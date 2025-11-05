const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Read .env or .env.local file manually
let envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  envPath = path.join(__dirname, '.env');
}

if (!fs.existsSync(envPath)) {
  console.error('❌ ERROR: .env or .env.local file not found');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');

const env = {};
envLines.forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let value = match[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
});

process.env = { ...process.env, ...env };

async function diagnoseConnection() {
  const mongoUri = process.env.MONGODB_URI;
  
  console.log('\n========================================');
  console.log('MongoDB Connection Diagnostic');
  console.log('========================================\n');
  
  if (!mongoUri) {
    console.error('❌ ERROR: MONGODB_URI not found in .env file');
    process.exit(1);
  }
  
  console.log('📋 Connection String Analysis:');
  
  // Parse URI to show components
  const uriMatch = mongoUri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]*)/);
  if (uriMatch) {
    console.log(`  Username: ${uriMatch[1]}`);
    console.log(`  Password: ${'*'.repeat(uriMatch[2].length)}`);
    console.log(`  Host: ${uriMatch[3]}`);
    console.log(`  Database: ${uriMatch[4] || '(default)'}`);
  }
  
  console.log('\n⏳ Attempting connection with 5 second timeout...\n');
  
  try {
    const connection = await Promise.race([
      mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout after 5 seconds')), 5000)
      ),
    ]);
    
    console.log('✅ SUCCESS: Connected to MongoDB!');
    
    const db = connection.connection.db;
    console.log(`\n📊 Database Details:`);
    console.log(`  Database Name: ${db.getName()}`);
    console.log(`  Host: ${connection.connection.host}`);
    console.log(`  Port: ${connection.connection.port}`);
    
    const collections = await db.listCollections().toArray();
    console.log(`\n📦 Available Collections:`);
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
    
    await mongoose.disconnect();
    console.log('\n✅ Disconnected successfully');
    
  } catch (error) {
    console.error('❌ CONNECTION FAILED\n');
    console.error(`Error: ${error.message}\n`);
    
    console.log('🔧 Troubleshooting Checklist:');
    console.log('1. ✓ Check IP Whitelist in MongoDB Atlas:');
    console.log('     - Go to https://cloud.mongodb.com');
    console.log('     - Network Access → IP Whitelist');
    console.log('     - Add your current IP or 0.0.0.0/0');
    console.log('');
    console.log('2. ✓ Verify Credentials:');
    console.log('     - Username: vyash1053');
    console.log('     - Check if password has special characters');
    console.log('     - If so, they must be URL encoded');
    console.log('');
    console.log('3. ✓ Check Connection String Format:');
    console.log('     - Should be: mongodb+srv://user:password@host.mongodb.net/');
    console.log('     - Special chars in password? Use: mongodb+srv://user:pass%40word@host.mongodb.net/');
    console.log('');
    console.log('4. ✓ Verify Database User Permissions:');
    console.log('     - Go to Database Access in MongoDB Atlas');
    console.log('     - Ensure user has "readWrite" role');
    console.log('');
    console.log('5. ✓ Check Network Connectivity:');
    console.log('     - Try: ping cluster0.jfia8.mongodb.net');
    console.log('     - Or test with: telnet cluster0.jfia8.mongodb.net 27017');
    console.log('');
  }
}

diagnoseConnection();
