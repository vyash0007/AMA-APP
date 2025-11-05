import mongoose from 'mongoose';

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  // Check if we have a connection to the database or if it's currently connecting
  if (connection.isConnected) {
    console.log('Already connected to the database');
    return;
  }

  try {
    // Attempt to connect to the database
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.warn('MONGODB_URI environment variable is not set - Database disabled');
      return;
    }

    const db = await Promise.race([
      mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 3000,
        socketTimeoutMS: 3000,
        connectTimeoutMS: 3000,
        maxPoolSize: 5,
        minPoolSize: 1,
        retryWrites: true,
        retryReads: true,
        w: 'majority',
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout after 4 seconds')), 4000)
      ),
    ]) as Awaited<ReturnType<typeof mongoose.connect>>;

    connection.isConnected = db.connections[0].readyState;
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error instanceof Error ? error.message : String(error));
    console.warn('📝 Continuing with limited functionality - please check:');
    console.warn('   1. MongoDB connection string is correct');
    console.warn('   2. Database credentials are valid');
    console.warn('   3. IP address is whitelisted in MongoDB Atlas');
    console.warn('   4. Network connectivity to MongoDB Atlas');
    
    // Disconnect to prevent buffering
    try {
      await mongoose.disconnect();
    } catch (e) {
      // Ignore disconnect errors
    }
    connection.isConnected = 0;
    throw error; // Re-throw to let the route handler know
  }
}

export default dbConnect;
