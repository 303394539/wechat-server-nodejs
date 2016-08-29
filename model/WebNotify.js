var oop = require("../libs/oop");
var Promise = require("promise");

var WebNotify = oop.extends({
	openid: "",
	appid: "",
	url: "",
	requestParam: {},
	query: {},
	cookies: {},
	getRequestParam: function(){
		return this.get("requestParam");
	},
	getAppid: function(){
		return this.get("appid");
	},
	getOpenid: function(){
		return this.get("openid");
	},
	getQuery: function(){
		return this.get("query");
	},
	getCookies: function(){
		return this.get("cookies");
	}
})

module.exports = WebNotify;
