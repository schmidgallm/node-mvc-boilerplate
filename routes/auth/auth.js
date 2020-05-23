// Dependecies
const dotenv = require('dotenv');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');

const router = express.Router();
dotenv.config();

// @route    GET api/v1/auth/auth
// @desc     Get logged in user
// @access   Public
router.get('/', auth, async (req, res) => {
  try {
    // Find user and subtract password and return user object
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/v1/auth/auth
// @desc    Authenticate user and get token
// @access  PUBLIC
router.post(
  '/',
  // express validator checks
  [
    check('email', 'Please include valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    // if errors from validation exists
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // req.body destructure
    const { email, password } = req.body;

    try {
      // check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      // check if password matches
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      // init jwt payload with user id
      const payload = {
        user: {
          id: user.id
        }
      };

      // sign token and send token to user
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.warn(err.message);
      res.status(500).send('Server Error...');
    }
  }
);
module.exports = router;
