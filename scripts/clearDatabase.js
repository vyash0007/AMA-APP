// Script to clear MongoDB database of old invalid users
const mongoose = require('mongoose');

const mongoUri = 'mongodb+srv://vyash1053:vyash1053@cluster0.jfia8.mongodb.net/?appName=Cluster0';

async function clearDatabase() {
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });

    console.log('Connected to MongoDB');

    // Drop the users collection to start fresh
    const result = await mongoose.connection.collection('users').deleteMany({});
    console.log(`Deleted ${result.deletedCount} old users from database`);

    console.log('Database cleared successfully. You can now sign up new users.');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error.message);
    process.exit(1);
  }
}

clearDatabase();
