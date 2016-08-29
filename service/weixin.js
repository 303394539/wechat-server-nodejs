var Promise = require("promise");
var uuid = require("uuid");
var CONSTANT = require("../constant");
var CONFIG = require("../config");

var wxutil = require("../libs/weixin");
var time = require("../libs/time");
var dao = require("../libs/dao");
var cache = require("../libs/cache");
var log = require("../libs/log");

var User = require("../model/User");
var Sharelog = require("../model/Sharelog");
var Subscribelog = require("../model/Subscribelog");

module.exports = {
	subscribe: function(data){
		return wxutil.getUserinfoByWx(data.fromusername).then(function(obj){
			var user = User.serializable(obj);
			user.set("uuid", uuid.v1());
			user.set("appid", CONFIG.APPID);
			user.set("state", 1);
			user.set("firstsubscribetime", time.getDBTime());
			user.set("subscribetime", time.getDBTime());
			user.set("createtime", time.getDBTime());
			user.set("lastmodify", time.getDBTime());
			return dao.save(user).then(function(){
				return dao.queryForObject("Sharelog", "select * from share_log where createtime >= ${createtime} and openid=${openid} and openid != superid order by createtime desc limit 1", [user.createtime, user.openid]).then(function(obj){
					if(obj.superid){
						var subscribelog = new Subscribelog();
						subscribelog.set("uuid", uuid.v1());
						subscribelog.set("openid", user.openid);
						subscribelog.set("superid", obj.superid);
						subscribelog.set("createtime", time.getDBTime());
						dao.save(subscribelog);
					}
					return Promise.resolve();
				}).catch(function(){
					return Promise.resolve();
				})
			}).then(function(){
				return cache.set(user.openid, user, CONSTANT.USER_CACHE_EXPIRES)
			}).catch(function(){
				return dao.update(user, "update user set " +
					"nickname=${nickname},sex=${sex},province=${province},city=${city},country=${country},headimgurl=${headimgurl},state=${state},subscribetime=${subscribetime},lastmodify=${lastmodify} " + 
					"where openid=${openid}")
			}).then(function(){
				return Promise.resolve("");
			}).catch(function(e){
				log.error(e)
				return Promise.resolve("");
			});
		})
	},
	unsubscribe: function(data){
		return dao.queryForObject("User", "select * from user where openid=?", [data.fromusername]).then(function(obj){
			if(!obj){
				return Promise.reject();
			}
			return Promise.resolve(obj);
		}).then(function(user){
			user.set("lastmodify", time.getDBTime());
			return dao.update(user, "update user set state=2,lastmodify=${lastmodify} where openid=${openid}").then(function(){
				return Promise.resolve(user)
			});
		}).then(function(user){
			return cache.set(user.openid, user, CONSTANT.USER_CACHE_EXPIRES)
		}).then(function(){
			return Promise.resolve("");
		}).catch(function(){
			log.error(e)
			return Promise.resolve("");
		})
	},
	oauth: function(code){
		return wxutil.getAuthTokenObj(code).then(function(obj){
			if(obj.scope == CONSTANT.SNSAPI_USERINFO){
				return wxutil.getUserinfoByWx(obj.openid).then(function(obj){
					var user = User.serializable(obj);
					user.set("uuid", uuid.v1());
					user.set("appid", CONFIG.APPID);
					user.set("state", 1);
					user.set("firstsubscribetime", time.getDBTime());
					user.set("subscribetime", time.getDBTime());
					user.set("createtime", time.getDBTime());
					user.set("lastmodify", time.getDBTime());
					return dao.save(user).catch(function(){
						return dao.update(user, "update user set " +
							"nickname=${nickname},sex=${sex},province=${province},city=${city},country=${country},headimgurl=${headimgurl},state=${state},subscribetime=${subscribetime},lastmodify=${lastmodify} " + 
							"where openid=${openid}")
					}).then(function(user){
						return cache.set(user.openid, user, CONSTANT.USER_CACHE_EXPIRES)
					}).then(function(){
						return Promise.resolve(user);
					}).catch(function(e){
						log.error(e)
						return Promise.resolve(user);
					});
				})
			}else{
				var user = new User();
				user.set("uuid", uuid.v1());
				user.set("appid", CONFIG.APPID);
				user.set("openid", obj.openid);
				user.set("createtime", time.getDBTime());
				user.set("lastmodify", time.getDBTime());
				return dao.save(user).then(function(user){
					return cache.set(user.openid, user, CONSTANT.USER_CACHE_EXPIRES);
				}).then(function(){
					return Promise.resolve(user);
				}).catch(function(e){
					log.error(e)
					return Promise.resolve(user);
				})
			}
		})
	}
};
