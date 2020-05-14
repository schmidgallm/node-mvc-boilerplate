require('dotenv').config();
const mongoose = require('mongoose');

// Options object to pass to mongo client
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

// init connection to db
// Check node enviorment to see what DB to connect to
const connectDB = async () => {
  try {
    // Check if dev or prod and use each db accordingly
    const env = process.env.NODE_ENV;
    if (env === 'production') {
      await mongoose.connect(process.env.MONGODB_URI, options, () => {
        console.log('> MongoDB Production Successfully Connected...');
      });
    } else {
      await mongoose.connect(process.env.MONGODB_DEV_URI, options, () => {
        console.log('> MongoDB Development Successfully Connected...');
      });
    }
  } catch (err) {
    console.log('-------------');
    console.error(err.name);
    console.log('-------------');
    console.log(err.message);
  }
};

module.exports = connectDB;
