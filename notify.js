require('dotenv').config({silent: true});

var mongoose = require('mongoose');
var axios = require('axios');
var _ = require('lodash');
var User = require('./models/users');

console.log(process.env.DB_CONNECTION);
mongoose.connect(process.env.DB_CONNECTION);

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
      axios.get('http://dataservice.accuweather.com/forecasts/v1/daily/1day/351193?apikey=qSOlHuy0vvmhUQXyFnc91Q1uv8o4cGcg&details=true')
        .then(function (res) {
          var todayAllergens= res.data['DailyForecasts'][0]['AirAndPollen'];

          var highAllergens = [];
          todayAllergens.forEach(function (allergen) {
            if (allergen['Category'] == 'High' || allergen['Category'] == 'Unhealthy' || allergen['Category'] == 'Hazardous') {
              highAllergens.push(_.toLower(allergen['Name']));
            };
          });

          for (var i = 0; i < users.length; i++) {
            user = users[i];
            var allergyIntersect = _.intersection(highAllergens, user.allergens);
            var hasAllergy = allergyIntersect.length > 0;

            if(hasAllergy) {
              // Send email
              console.log(allergyIntersect);
            }
          }

        })
    }
  })
})
