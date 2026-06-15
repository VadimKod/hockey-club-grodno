require('dotenv').config();
const mongoose = require('mongoose');

console.log('Mongoose version:', mongoose.version);

try {
  const mongodb = require('mongodb');
  console.log('MongoDB driver version:', mongodb.version);
} catch(e) {
  console.log('MongoDB driver: not directly installed');
}

console.log('Connecting to:', process.env.MONGODB_URI?.replace(/:.*@/, ':****@'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('SUCCESS: Connected to MongoDB!');
    process.exit(0);
  })
  .catch((err) => {
    console.log('ERROR:', err.message);
    console.log('Full error:', err);
    process.exit(1);
  });
