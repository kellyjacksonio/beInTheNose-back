require('dotenv').config({silent: true});

var mongoose = require('mongoose');
console.log(process.env.DB_CONNECTION);
mongoose.connect(process.env.DB_CONNECTION);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {
  var User = require('./models/users');

  newUser = new User({
    email: 'clrksanford@gmail.com',
    allergens: ['mold', 'tree', 'grass', 'ragweed']
  });

  newUser.save(function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log('Success', newUser);
    }
  })
})
