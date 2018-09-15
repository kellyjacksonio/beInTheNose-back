const mongoose = require('mongoose');

var userSchema = {
  email: String,
  allergens: Array,
}

var user = mongoose.model('User', userSchema);

module.exports = user;
