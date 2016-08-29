var Promise = require("promise");
var time = require("../libs/time");
var wxutil = require("../libs/weixin");
var dao = require("../libs/dao");
var WebNotify = require("../model/WebNotify");
var ServerNotify = require("../model/ServerNotify");
var Sharelog = require("../model/Sharelog");
var User = require("../model/User");
var uuid = require("uuid");
var util = require("../libs/util");
var log = require("../libs/log");
var CONFIG = require("../config");
var CONSTANT = require("../constant");

module.exports = {
	getGlobal: function(webNotify, serverNotify){
		return Promise.resolve(serverNotify);
	},
	share: function(webNotify, serverNotify, req, res){
		var cookies = webNotify.getCookies();
		var query = webNotify.getQuery();
		return new Promise(function(resolve, reject){
			if(!query.superid || !query.state){
				return resolve();
			}
			if(query.state){
				serverNotify.setRedirecturl(query.state);
			}
			if(cookies.openid){
				var sharelog = new Sharelog();
				sharelog.set('uuid', uuid.v1());
				sharelog.set('openid', cookies.openid);
				sharelog.set('superid', query.superid);
				sharelog.set('scene', query.scene);
				sharelog.set('url', query.state);
				sharelog.set("createtime", time.getDBTime());
				dao.save(sharelog).then(function(){
					resolve();
				}).catch(function(){
					reject();
				})
			}else{
				serverNotify.setRedirecturl(
					CONSTANT.OAUTH_BASE_URL
						.replace("${appid}", CONFIG.APPID)
						.replace("${hostname}", CONFIG.HOSTNAME)
						.replace("${url}", encodeURIComponent(CONFIG.PROTOCOL + CONFIG.HOSTNAME + req.originalUrl))
				);
				resolve();
			}

		}).then(function(){
			if(cookies.openid){
				return User.getCache(cookies.openid).then(function(user){
					return Promise.resolve(util.responseCookies(res, {
						openid: user.openid,
						appid: user.appid,
						uuid: user.uuid
					}, {
						path: "/"
					}));
				})
			}else{
				return Promise.resolve();
			}
		}).then(function(){
			return Promise.resolve(serverNotify);
		}).catch(function(e){
			log.error(e)
			return Promise.resolve();
		})
	}
};
