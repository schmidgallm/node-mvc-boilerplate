// Dependencies
const express = require('express');

// init express router
const router = express.Router();

// @route   GET api/v1/users/user
// @desc    GET all items
// @access  PUBLIC
router.get('/', async (req, res) => {
  try {
    console.log('hello');
    return res.send('got all items');
  } catch (err) {
    console.warn(err.message);
    return res.status(500).send('Server Error');
  }
});
module.exports = router;
