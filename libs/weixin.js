var Promise = require("promise");
var cache = require("./cache");
var CONFIG = require("../config");
var log = require("./log");
var util = require("./util");
var time = require("./time");
var CONSTANT = require("../constant");
var sha1 = require('sha1');
var uuid = require("uuid");

module.exports = {
	getToken: function(){
		var key = CONFIG.APPID + CONFIG.APPSECRET + "access_token";
		return cache.get(key).then(function(token){
			if(token){
				return Promise.resolve(token);
			}else{
				return util.httpsGet(
					CONSTANT.TOKEN_URL
						.replace("${appid}", CONFIG.APPID)
						.replace("${appsecret}", CONFIG.APPSECRET)
					).then(function(data){
						return cache.set(key, data.access_token, data.expires_in - 1000).then(function(){
							return Promise.resolve(data.access_token)
						}).catch(function(e){
							log.error(e)
						})
					}).catch(function(e){
						log.error(e)
					})
			}
		}).catch(function(e){
			log.error(e)
		});
	},
	getUserinfoByWx: function(openid){
		return this.getToken().then(function(token){
			return util.httpsGet(
				CONSTANT.USERINFO_URL
					.replace("${token}", token)
					.replace("${openid}", openid)
				).then(function(data){
					return Promise.resolve(data)
				}).catch(function(e){
					log.error(e)
				})
		})
	},
	getAuthTokenObj: function(code){
		return util.httpsGet(
			CONSTANT.AUTH_TOKEN_URL
				.replace("${appid}", CONFIG.APPID)
				.replace("${code}", code)
				.replace("${appsecret}", CONFIG.APPSECRET)
			).then(function(data){
				return Promise.resolve(data)
			}).catch(function(e){
				log.error(e)
			})
	},
	getJsapiTicket: function(){
		return this.getToken().then(function(token){
			var key = CONFIG.APPID + CONFIG.APPSECRET + "jsapi_ticket";
			return cache.get(key).then(function(ticket){
				if(ticket){
					return Promise.resolve(ticket);
				}else{
					return util.httpsGet(
						CONSTANT.JSAPI_TICKET_URL
							.replace("${token}", token)
						).then(function(data){
							return cache.set(key, data.ticket, data.expires_in - 1000).then(function(){
								return Promise.resolve(data.ticket)
							}).catch(function(e){
								log.error(e)
							})
						}).catch(function(e){
							log.error(e)
						})
				}
			}).catch(function(e){
				log.error(e)
			})
		})
	},
	getSignatureObj: function(url){
		return this.getJsapiTicket().then(function(ticket){
			var noncestr = uuid.v1();
			var timestamp = time.getTimestamp();
			var signature = sha1(CONSTANT.SIGNATURE_FORMAT
												.replace("${ticket}", ticket)
												.replace("${noncestr}", noncestr)
												.replace("${timestamp}", timestamp)
												.replace("${url}", url));
			return Promise.resolve({
				timestamp: timestamp,
				nonceStr: noncestr,
				signature: signature
			});
		})
	}
}
