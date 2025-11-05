#!/usr/bin/env node

const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('URI:', process.env.MONGODB_URI || 'mongodb+srv://vyash1053:vyash1053@cluster0.jfia8.mongodb.net/ama_app?retryWrites=true&w=majority');
    
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb+srv://vyash1053:vyash1053@cluster0.jfia8.mongodb.net/ama_app?retryWrites=true&w=majority',
      {
        serverSelectionTimeoutMS: 5000,
      }
    );
    
    console.log('✅ Connected successfully!');
    
    // Try to get database stats
    const admin = mongoose.connection.db.admin();
    const dbStats = await admin.serverStatus();
    console.log('Database is accessible');
    
    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
