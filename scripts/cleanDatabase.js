#!/usr/bin/env node

/**
 * Clean Database Script
 * Removes all users with invalid timestamp IDs from MongoDB
 * Only keeps users with proper 24-character ObjectId format
 */

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://vyash1053:vyash1053@cluster0.jfia8.mongodb.net/ama_app?retryWrites=true&w=majority';

async function cleanDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Find all documents
    const allUsers = await usersCollection.find({}).toArray();
    console.log(`📊 Total users in database: ${allUsers.length}`);

    if (allUsers.length === 0) {
      console.log('✨ Database is already clean!');
      process.exit(0);
    }

    // Identify invalid users (non-24 char hex ObjectIds)
    const invalidUsers = allUsers.filter(user => {
      const idString = user._id.toString();
      // Valid MongoDB ObjectId is a 24-character hex string
      const isValid = /^[0-9a-f]{24}$/.test(idString);
      return !isValid;
    });

    if (invalidUsers.length === 0) {
      console.log('✨ All users have valid ObjectIds!');
      process.exit(0);
    }

    console.log(`\n⚠️  Found ${invalidUsers.length} invalid users:`);
    invalidUsers.forEach(user => {
      console.log(`  - ID: ${user._id}, Username: ${user.username}, Email: ${user.email}`);
    });

    // Delete invalid users
    console.log(`\n🗑️  Deleting ${invalidUsers.length} invalid users...`);
    const invalidIds = invalidUsers.map(u => u._id);
    const result = await usersCollection.deleteMany({ _id: { $in: invalidIds } });

    console.log(`✅ Deleted ${result.deletedCount} invalid users`);
    console.log(`📊 Remaining users: ${allUsers.length - result.deletedCount}`);

    console.log('\n✨ Database cleanup complete!');
    console.log('💡 Tip: Sign up with a NEW email and username to create fresh users with valid ObjectIds');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

cleanDatabase();
