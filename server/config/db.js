const mongoose = require('mongoose');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
  });
  console.log(`MongoDB подключена: ${conn.connection.host}`);
  return conn;
};

module.exports = connectDB;
