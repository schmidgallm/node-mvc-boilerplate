// Dependencies
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  item_id: String,
  item_description: String,
  price: Number
});

const Product = mongoose.model('product', ProductSchema);

module.exports = Product;
