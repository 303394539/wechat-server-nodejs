var express = require('express');
var router = express.Router();

var service = require("../service/service");

router.all('/', function(req, res, next) {
	res.send()
});

router.all('/getGlobal.do', function(req, res){
	service("getGlobal", req).then(function(data){
		res.send(data);
	})
})

router.all('/share.do', function(req, res){
	service("share", req, res).then(function(data){
		if(data.redirecturl){
			res.redirect(data.redirecturl);
		}else{
			res.send("");
		}
	})
})

module.exports = router;
