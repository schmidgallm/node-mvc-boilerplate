// Dependencies
const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  status: String, // status will mark if user is customer or admin
  order_history: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'orders' }]
  }
});

const Profile = mongoose.model('profile', ProfileSchema);

module.exports = Profile;
