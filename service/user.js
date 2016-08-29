var wxutil = require("../libs/weixin");
var Promise = require("promise");
var User = require("../model/User");
var CONFIG = require("../config");
var time = require("../libs/time");
var dao = require("../libs/dao");
var uuid = require("uuid");
var CONSTANT = require("../constant");
var cache = require("../libs/cache");
var log = require("../libs/log");

var User = require("../model/User");
var WebNotify = require("../model/WebNotify");
var ServerNotify = require("../model/ServerNotify");

module.exports = {
	refreshAllUserinfo: function(webNotify, serverNotify){
		var appid = webNotify.getRequestParam().appid || webNotify.getAppid();
		return dao.queryForList("User", "select * from user where appid=?", appid).then(function(list){
			serverNotify.setObj(list);
			return Promise.resolve(serverNotify);
		})
	},
	getUserinfo: function(webNotify, serverNotify){
		var openid = webNotify.getRequestParam.openid || webNotify.getOpenid();
		return User.getCache(openid).then(function(user){
			serverNotify.setObj(user);
			return Promise.resolve(serverNotify);
		}).catch(function(e){
			log.error(e)
			return Promise.resolve(serverNotify);
		})
	}
};
