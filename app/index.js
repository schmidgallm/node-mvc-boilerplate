// Dependencies
const express = require('express');
const logger = require('morgan');
const cors = require('cors');

// Import Routes
const authRoute = require('../routes/auth/auth');
const userAuthRoute = require('../routes/auth/user');
const productRoute = require('../routes/api/product');

// Init express app
const app = express();

// Use morgan to log all requests
app.use(logger('dev'));

// Body Parser Middleware
app.use(express.json({ extended: true }));

// Cors middleware
app.use(cors());

// Init api auth routes Here
app.use('/api/v1/auth/auth', authRoute);
app.use('/api/v1/auth/users', userAuthRoute);

// Init api routes Here
app.use('/api/v1/products', productRoute);

// Export app to for server to use
module.exports = app;
