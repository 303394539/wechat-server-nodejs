var express = require('express');
var router = express.Router();

router.all('/', function(req, res, next) {
	res.send()
});

var global = require('./global');
router.use('/global', global);

var user = require('./user');
router.use('/user', user);

module.exports = router;
