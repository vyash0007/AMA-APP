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
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 5000,
        connectTimeoutMS: 5000,
        maxPoolSize: 5,
        minPoolSize: 2,
        retryWrites: true,
        retryReads: true,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout')), 8000)
      ),
    ]) as Awaited<ReturnType<typeof mongoose.connect>>;

    connection.isConnected = db.connections[0].readyState;
    console.log('Database connected successfully');
  } catch (error) {
    console.warn('Database connection not available - continuing without database');
    // Disconnect to prevent buffering
    try {
      await mongoose.disconnect();
    } catch (e) {
      // Ignore disconnect errors
    }
    connection.isConnected = 0;
    return;
  }
}

export default dbConnect;
