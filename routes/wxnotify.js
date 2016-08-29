var express = require('express');
var router = express.Router();
var xmlparser = require('express-xml-bodyparser');
var log = require("../libs/log");
var util = require("../libs/util");
var wxservice = require("../service/weixin");

router.all('/', function(req, res) {
	res.send();
});

router.all('/access.do', xmlparser({trim: false, explicitArray: false}),function(req, res){
	var data = req.body.xml;

	if(data){
		switch(data.event){
			case "subscribe":
				wxservice.subscribe(data).then(function(str){
					res.send(str);
				});
				break;
			case "unsubscribe":
				wxservice.unsubscribe(data).then(function(str){
					res.send(str);
				});
			default:
				res.send();
		}
	}else{
		res.send(req.query.echostr);
	}
})

router.get('/oauth.do', function(req, res){
	var code = req.query.code;
	var state = req.query.state;
	if(code){
		wxservice.oauth(code).then(function(user){
			log.info("用户授权以后定向：" + state);
			util.responseCookies(res, {
				openid: user.openid,
				appid: user.appid,
				uuid: user.uuid
			}, {
				path: "/"
			}).redirect(state);
		})
	}else{
		res.redirect(state)
	}
})

module.exports = router;
