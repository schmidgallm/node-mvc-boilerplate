// Dependencies
const express = require('express');
const auth = require('../../middleware/auth');

// init express router
const router = express.Router();

// import Models
const Product = require('../../models/Product');
const User = require('../../models/User');

/*
//
// GET REQUESTS
//
*/

// @route   GET api/v1/product
// @desc    GET all products
// @access  PUBLIC
router.get('/', async (req, res) => {
  try {
    // search for all product
    const product = await Product.find({})
      .populate('user', '-password')
      .sort({ item_id: 1 });

    // check if no product exists
    if (!product) {
      return res.status(404).json({ msg: 'No product found' });
    }

    // return all products
    return res.status(200).json(product);
  } catch (err) {
    console.warn(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route   GET api/v1/product/product_id
// @desc    GET one product
// @access  PUBLIC
router.get('/:id', async (req, res) => {
  // find product from request
  const product = await Product.findById(req.params.id).populate(
    'user',
    '-password'
  );

  try {
    // if product does not exist
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    return res.status(200).json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/*
//
// POST AND PUT REQUESTS
//
*/

// @route   POST api/v1/product
// @desc    POST a product
// @access  PRIVATE
router.post('/', auth, async (req, res) => {
  // desctrucutre request body
  const { item_id, description, price } = req.body;

  try {
    // find user and see if their status allows product creation
    const user = await User.findById(req.user.id);
    if (user.status !== 'admin') {
      return res
        .status(401)
        .json({ msg: 'You do not have access to create products' });
    }

    // check if product exists
    let product = await Product.findOne({ item_id: item_id });

    if (product) {
      return res.status(400).json({ msg: 'Product already exists' });
    }

    // if product does not exist then create new one
    product = new Product({
      item_id,
      description,
      price,
      user: req.user.id
    });

    // save to db
    await product.save();

    // return response
    return res.status(200).json(product);
  } catch (err) {
    console.warn(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route   PUT api/v1/product
// @desc    UPDATE product by id
// @access  PRIVATE
router.put('/:id', auth, async (req, res) => {
  // desctructure request body
  const { item_id, description, price } = req.body;

  // find user and see if their status allows product revision
  const user = await User.findById(req.user.id);
  if (user.status !== 'admin') {
    return res
      .status(401)
      .json({ msg: 'You do not have access to create products' });
  }

  // init product object to update db
  const productFields = {};
  productFields.user = req.user.id;
  productFields.last_updated = Date.now();
  if (item_id) productFields.item_id = item_id;
  if (description) productFields.description = description;
  if (price) productFields.price = price;

  try {
    // check if product exists
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(400).json({ msg: 'Product does not exist' });
    }

    // update db
    await product.updateOne({ $set: productFields }, { new: true });

    return res.status(200).json(product);
  } catch (err) {
    console.warn(err.message);
    return res.status(500).send('Server Error');
  }
});

/*
//
// DELETE REQUESTS
//
*/

// @route   DELETE api/v1/product
// @desc    DELETE product by id
// @access  PRIVATE
router.delete('/:id', auth, async (req, res) => {
  // find user and see if their status allows product revision
  const user = await User.findById(req.user.id);
  if (user.status !== 'admin') {
    return res
      .status(401)
      .json({ msg: 'You do not have access to create products' });
  }

  try {
    // find requested product
    const product = await Product.findById(req.params.id);

    // if product does not exists
    if (!product) {
      return res.status(400).json({ msg: 'Product does not exist' });
    }

    // delete from db
    await product.remove();

    return res.status(200).json({ msg: 'Product succesfully deleted' });
  } catch (err) {
    console.warn(err.message);
    return res.status(500).send('Server Error');
  }
});

module.exports = router;
