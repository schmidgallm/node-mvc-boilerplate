// Dependencies
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  product: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product'
    }
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  date_created: {
    type: Date,
    default: Date.now
  },
  date_updated: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('order', OrderSchema);

module.exports = Order;
