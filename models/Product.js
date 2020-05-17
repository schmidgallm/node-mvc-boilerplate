// Dependencies
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  item_id: {
    type: String,
    required: true
  },
  item_description: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  creation_date: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('product', ProductSchema);

module.exports = Product;
