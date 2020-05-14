// Dependecies
const dotenv = require('dotenv');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

dotenv.config();
const router = express.Router();

// @route   POST api/v1/user
// @desc    Create a user
// @access  PUBLIC
const User = require('../../models/User');

// user creation post route
router.post(
  '/',
  // express validator checks
  [
    check('user_name', 'User name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include valid email').isEmail(),
    check('password', 'password must be more than 6 characters').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      // if errors from validation exists
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // req.body destructure
      const { user_name, email, password } = req.body;

      // check if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      // init new user if not already exists
      user = await new User({
        user_name,
        email,
        password,
      });

      // salt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // save new user to db
      await user.save();

      // init jwt payload with user id
      const payload = {
        user: {
          id: user.id,
        },
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
