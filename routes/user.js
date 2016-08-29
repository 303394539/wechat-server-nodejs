var express = require('express');
var router = express.Router();
var cache = require('../libs/cache');
var Promise = require("promise");
var dao = require("../libs/dao");
var log = require("../libs/log");

var service = require("../service/service");

router.all('/', function(req, res, next) {
	res.send()
});

router.all('/refreshAllUserinfo.do', function(req, res){
	service("refreshAllUserinfo", req).then(function(data){
		res.send(data);
	})
})

router.all('/getUserinfo.do', function(req, res){
	service("getUserinfo", req).then(function(data){
		res.send(data);
	})
})

router.all('/info.do', function(req, res, next) {
	res.send("info.do")
});

router.all('/add.do', function(req, res, next) {
	res.send("add.do")
});

module.exports = router;
