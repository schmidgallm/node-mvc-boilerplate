// Dependencies
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  item_id: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  last_updated: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('product', ProductSchema);

module.exports = Product;
