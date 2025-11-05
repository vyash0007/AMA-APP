/**
 * MongoDB Connection Troubleshooting
 * Run this to diagnose connection issues
 * 
 * Issues to check:
 * 1. IP Whitelist: https://cloud.mongodb.com/v2/YOUR_ORG_ID#security/network/accessList
 * 2. Database User: Verify username/password are correct
 * 3. Connection String: Should be in format: mongodb+srv://username:password@host/?retryWrites=true&w=majority
 */

import mongoose from 'mongoose';

async function testConnection() {
  const mongoUri = process.env.MONGODB_URI;
  
  console.log('🔍 MongoDB Connection Test');
  console.log('============================');
  console.log('URI (redacted):', mongoUri?.replace(/:[^:]*@/, ':****@'));
  console.log('');
  
  if (!mongoUri) {
    console.error('❌ MONGODB_URI not set in .env');
    return;
  }

  try {
    console.log('⏳ Attempting connection...');
    
    const connection = await Promise.race([
      mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 3000,
        socketTimeoutMS: 3000,
        connectTimeoutMS: 3000,
        maxPoolSize: 2,
        retryWrites: true,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout after 5 seconds')), 5000)
      ),
    ]);

    console.log('✅ Connection successful!');
    console.log('Database:', connection.connection.db?.databaseName);
    console.log('Host:', connection.connection.host);
    console.log('Port:', connection.connection.port);
    
    // List collections
    const collections = await connection.connection.db?.listCollections().toArray();
    console.log('Collections:', collections?.map(c => c.name).join(', '));
    
    await mongoose.disconnect();
    console.log('✅ Disconnected');
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error:', error instanceof Error ? error.message : String(error));
    console.error('');
    console.error('💡 Troubleshooting steps:');
    console.error('1. Check MongoDB Atlas IP Whitelist');
    console.error('2. Verify username and password in connection string');
    console.error('3. Check network connectivity to MongoDB');
    console.error('4. Ensure password special characters are URL encoded');
  }
}

testConnection();
