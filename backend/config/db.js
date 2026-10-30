const mongoose = require('mongoose');

// Connects to MongoDB using MONGO_URI from .env. Throws a clear error if it fails.
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri || uri.includes('your_mongodb')) {
    throw new Error('MONGO_URI is missing. Copy .env.example to .env and add your MongoDB connection string.');
  }
  const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  console.log(`MongoDB connected: ${conn.connection.host}`);
};

module.exports = connectDB;
