var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('hit the endpoint');
  res.status(200).send();
});

module.exports = router;
