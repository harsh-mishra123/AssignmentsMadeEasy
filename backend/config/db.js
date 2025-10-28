const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('Full error:', err);
    if (process.env.MONGO_URI) {
      console.error('Connection URI (without password):', process.env.MONGO_URI.replace(/:[^:@]+@/, ':****@'));
    } else {
      console.error('MONGO_URI environment variable is not set');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
