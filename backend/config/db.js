/**
 * config/db.js
 * MongoDB Database Connection using Mongoose
 * UCLan HI4006 - HealthPlus Clinic Backend
 */

const mongoose = require('mongoose');
const dns = require('dns');

// Override DNS with Google Public DNS to fix "querySrv ECONNREFUSED" on restrictive networks
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Function to connect to MongoDB Atlas
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    console.error('Fix: 1) Resume Atlas cluster  2) Whitelist IP (0.0.0.0/0)  3) Check MONGO_URI in .env');
    console.warn('Server will continue without DB - API routes will fail until DB is connected.');
    // Retry after 10 seconds
    setTimeout(connectDB, 10000);
  }
};

module.exports = connectDB;
