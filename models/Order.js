// Dependencies
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  items: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category'
  },
  date_created: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('order', OrderSchema);

module.exports = Order;
