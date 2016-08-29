var oop = require("../libs/oop");
var Promise = require("promise");
var CODE = require("../code");

var ServerNotify = oop.extends({
	openid: "",
	errmsg: "",
	code: 0,
	obj: {},
	wxconfig: {},
	redirecturl: "",
	setCode: function(code){
		code = parseInt(code);
		if(code < 0){
			this.set("errmsg", CODE[code]);
			this.set("obj", {});
		}
		this.set("code", code);
		return this;
	},
	setObj: function(obj){
		this.set("obj", obj);
		return this;
	},
	setWxconfig: function(obj){
		this.set("wxconfig", obj);
		return this;
	},
	setRedirecturl: function(obj){
		this.set("redirecturl", obj);
		return this;
	}
})

module.exports = ServerNotify;
