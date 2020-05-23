// Dependencies
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
    validate: [
      input => {
        return input.length >= 6;
      },
      'Username must be at least 6 characters long'
    ]
  },
  status: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid-email address']
  },
  password: {
    type: String,
    required: true,
    validate: [
      input => {
        return input.length >= 6;
      },
      'Password must be at least 6 characters long'
    ]
  },
  order: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'order'
    }
  ],
  date_created: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
