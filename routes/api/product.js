// Dependencies
const express = require('express');
const auth = require('../../middleware/auth');

// init express router
const router = express.Router();

// import Models
const Product = require('../../models/Product');

// @route   GET api/v1/product
// @desc    GET all products
// @access  PUBLIC
router.get('/', async (req, res) => {
  try {
    // search for all product
    const product = await Product.find({}).sort({ item_id: 1 });

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

// @route   POST api/v1/product
// @desc    POST a product
// @access  PRIVATE
router.post('/', auth, async (req, res) => {
  // desctrucutre request body
  const { item_id, description, price } = req.body;

  try {
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
      created_by: req.user.id
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
module.exports = router;
