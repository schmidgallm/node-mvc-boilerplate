const express = require('express');
const auth = require('../../middleware/auth');

// init express router
const router = express.Router();

// import Models
const Order = require('../../models/Order');
const User = require('../../models/User');
const Product = require('../../models/Product');

/*
//
// GET REQUESTS
//
*/

// @route   GET api/v1/orders
// @desc    GET all orders
// @access  PRIVATE
router.get('/', auth, async (req, res) => {
  // check if user has admin rights
  const user = await User.findById(req.user.id);
  if (user.status !== 'admin') {
    return res.status(401).json({ msg: 'Not authorized' });
  }

  try {
    // find all orders and sort by oldest to newest
    const order = await Order.find()
      .populate('product', '-user')
      .populate('user', '-password')
      .sort({ date_created: 1 });

    // if no orders exists
    if (!order || order.length === 0) {
      return res.status(400).json({ msg: 'No orders found' });
    }

    return res.status(200).json(order);
  } catch (err) {
    console.warn(err.message);
    return res.status(500).send('Server Error');
  }
});

/*
//
// POST AND PUT REQUESTS
//
*/

// @route   POST api/v1/orders
// @desc    POST all orders
// @access  PRIVATE
router.post('/', auth, async (req, res) => {
  // desctructure request body
  const { products } = req.body;
  console.log(products);

  try {
    const order = new Order({
      product: products.map(prod => prod),
      user: req.user.id
    });

    // save to db
    await order.save();

    // return response
    return res
      .status(200)
      .json({ msg: `Order created. Order ID: ${order.id}` });
  } catch (err) {
    console.warn(err.message);
    return res.status(500).send('Server Error');
  }
});

module.exports = router;
