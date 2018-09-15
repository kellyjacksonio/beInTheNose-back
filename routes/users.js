var express = require('express');
var router = express.Router();
var _ = require('lodash');
var User = require('../models/users');

/* POST user to database. */
router.post('/', function(req, res, next) {
  req.body = _.pick(req.body, ['email', 'allergens']);
  console.log(req.body);
  var user = new User(req.body);

  user.save(user, function (err) {
    if (err) {
      res.status(500).send();
    } else {
      res.status(204).send();
    }
  });
});

/* DELETE user from database */
router.delete('/:Id', function (req, res, next) {
  console.log(req.params.Id);
  User.findById(req.params.Id, function (err, user) {
    if (err) {
      res.status(500).send();
    } else if (!user) {
      res.status(404).send();
    } else {
      user.remove(function (err) {
        if (err) {
          res.status(500).send();
        } else {
          res.status(204).send();
        }
      });
    }
  });
});

module.exports = router;
