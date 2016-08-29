var oop = require("../libs/oop");
var Promise = require("promise");
var dao = require("../libs/dao");
var CONSTANT = require("../constant");
var cache = require("../libs/cache");

var User = oop.extends({
	openid: "",
	uuid: "",
	appid: "",
	mobile: "",
	name: "",
	nickname: "",
	sex: 0,
	province: "",
	city: "",
	country: "",
	headimgurl: "",
	cardno: "",
	state: 0,
	firstsubscribetime: "",
	subscribetime: "",
	createtime: "",
	lastmodify: "",
	tablename: "user",
	primaryKey: "openid",
	immutable: ["openid", "uuid"],
	static: {
		getCache: function(openid){
			return cache.get(openid).then(function(user){
				if(user){
					return Promise.resolve(user);
				}else{
					return dao.queryForObject("User", "select * from user where openid=?", openid).then(function(user){
						return cache.set(openid, user, CONSTANT.USER_CACHE_EXPIRES).then(function(){
							return Promise.resolve(user);
						})
					})
				}
			})
		}
	}
})

module.exports = User;