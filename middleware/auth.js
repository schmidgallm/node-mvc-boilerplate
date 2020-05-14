// Dependecies
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// Init dotenv configuration
dotenv.config();

// Export function to take in req/res so we can call this on all api routes in need of authentication
module.exports = async (req, res, next) => {
  // get token from request header
  const token = req.header('x-auth-token');

  // if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;

    // init next function
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
