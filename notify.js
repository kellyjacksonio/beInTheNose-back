require('dotenv').config({silent: true});

var mongoose = require('mongoose');
var axios = require('axios');
var _ = require('underscore');
var User = require('./models/users');

mongoose.connect(process.env.DB_CONNECTION);
console.log(process.env.DB_CONNECTION);

var db = mongoose.connection;
db.on('connected', function () {
    console.log('connected')
})
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {
  var users = User.find({}, function (err, users) {
    if(err) {
      console.log(err);
    } else {
      var highAllergens = ['mold', 'tree'];
      for (var i = 0; i < users.length; i++) {
        user = users[i];
        var allergyIntersect = _.intersection(highAllergens, user.allergens);
        var hasAllergy = allergyIntersect.length > 0;

        if(hasAllergy) {
          // Send email
          console.log(allergyIntersect);
        }
      }
    }
  })
})
