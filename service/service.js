var Promise = require("promise");
var CONSTANT = require("../constant");
var log = require("../libs/log");
var time = require("../libs/time");
var wxutil = require("../libs/weixin");

var user = require("./user");
var global = require("./global");

var WebNotify = require("../model/WebNotify");
var ServerNotify = require("../model/ServerNotify");

var ServiceList = {
	getGlobal: {
		handler: global.getGlobal
	},
	share: {
		noN: true,
		handler: global.share
	},
	refreshAllUserinfo: {
		handler: user.refreshAllUserinfo
	},
	getUserinfo: {
		handler: user.getUserinfo
	}
}

var Service = function(serviceName, req, res){
	var service = ServiceList[serviceName];
	var query = req.method === "POST" ? req.body : req.query;
	var n = query.n;
	var cookies = req.cookies;
	return new Promise(function(resolve, reject){
		if(!service){
			var serverNotify = new ServerNotify();
			serverNotify.setCode(CONSTANT.ERROR_REQUEST);
			return reject(serverNotify.toJson());
		}
		if(!service.noN && !n){
			var serverNotify = new ServerNotify();
			serverNotify.setCode(CONSTANT.ERROR_REQUEST);
			return reject(serverNotify.toJson());
		}
		var data;
		try{
			data = n ? JSON.parse(decodeURIComponent(n)) : {};
			data.query = query;
			data.cookies = cookies;
		}catch(err){
			log.error(err);
			var serverNotify = new ServerNotify();
			serverNotify.setCode(CONSTANT.ERROR_PARAMS);
			return reject(serverNotify.toJson());
		}
		var webNotify = WebNotify.serializable(data);
		var serverNotify = ServerNotify.serializable(data);
		wxutil.getSignatureObj(webNotify.url).then(function(obj){
			return Promise.resolve(serverNotify.setWxconfig(obj));
		}).then(function(serverNotify){
			service.handler.call(this, webNotify, serverNotify, req, res).then(function(notify){
				resolve(notify.toJson());
			}).catch(function(err){
				log.error(err);
				var serverNotify = new ServerNotify();
				serverNotify.setCode(CONSTANT.ERROR_REQUEST);
				return reject(serverNotify.toJson());
			})
		})
	}).then(function(data){
		log.info(serviceName + "(" + time.format("yyyy-mm-dd HH:ii:ss") + ")：" + JSON.stringify(data))
		return Promise.resolve(data);
	}).catch(function(data){
		log.info(serviceName + "(" + time.format("yyyy-mm-dd HH:ii:ss") + ")：" + JSON.stringify(data))
		return Promise.resolve(data);
	});
}

module.exports = Service;
