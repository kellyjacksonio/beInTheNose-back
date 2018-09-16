require('dotenv').config({silent: true});

var mongoose = require('mongoose');
var axios = require('axios');
var _ = require('lodash');
var User = require('./models/users');
var hbs = require('nodemailer-express-handlebars');
var nodemailer = require('nodemailer');

console.log(process.env.DB_CONNECTION);
mongoose.connect(process.env.DB_CONNECTION);

var notify = function() {
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
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
              host: 'smtp-mail.outlook.com',
              port: 587,
              secure: false, // true for 465, false for other ports
              auth: {
                  user: process.env.EMAIL_USER,
                  pass: process.env.EMAIL_PASSWORD
              }
            });

            var options = {
              extName:'.handlebars',
              viewPath:__dirname+'/templates/'
            }

            //allow for nodemailer to use handlebars
            transporter.use('compile', hbs(options));

            // setup email data with unicode symbols
            let mailOptions = {
              from: '"Be In The Nose" <beinthenose@outlook.com>', // sender address
              to: user.email, // list of receivers
              subject: 'Allergens of the Day', // Subject line
              template: 'email',
              context: {
                allergens: allergyIntersect
              }
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                  return console.log(error);
              }
              console.log('Message sent: %s', info.messageId);
            });
            console.log(allergyIntersect);
          }
        }
      }
    });


module.exports = notify;