const express = require('express');
const auth = require('../../middleware/auth');

// init express router
const router = express.Router();

// import Models
const Order = require('../../models/Order');
const User = require('../../models/User');

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

// @route   GET api/v1/orders/:id
// @desc    GET order by id
// @access  PRIVATE
router.get('/order/:id', auth, async (req, res) => {
  // check if user has admin rights
  const user = await User.findById(req.user.id);
  if (user.status !== 'admin') {
    return res.status(401).json({ msg: 'Not authorized' });
  }

  try {
    // find order and populate with product
    const order = await Order.findById(req.params.id).populate('product');

    // if no orders exists
    if (!order || order.length === 0) {
      return res.status(400).json({ msg: 'Order not found' });
    }

    return res.status(200).json(order);
  } catch (err) {
    console.warn(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route   GET api/v1/orders/myorders
// @desc    GET orders placed by logged in user
// @access  PRIVATE
router.get('/myorders', auth, async (req, res) => {
  try {
    // find orders created by logged in users
    const orders = await Order.find({
      user: { $in: req.user.id }
    }).populate('product', '-user, -last_updated');

    // if no orders
    if (!orders) {
      return res.status(401).json({ msg: 'No orders created yet' });
    }

    return res.status(200).json(orders);
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

    // Update user profile with new order
    await User.findByIdAndUpdate(req.user.id, { $push: { order: order.id } });

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
