var redis = require("redis"),
	rc = redis.createClient();
var util = require("./util");
var Promise = require("promise");
var log = require("../libs/log");

var cache = function() {};

rc.on("error", function (err) {
	log.error(err);
});

util.extend(cache.prototype, {
	set: function(key, value, expire) {
		var self = this;
		return new Promise(function(resolve, reject) {
			rc.set(key, JSON.stringify(value), function(err) {
				if (err) reject(err);
			});
			if (expire) {
				rc.expire(key, expire, function(err) {
					if (err) reject(err);
				});
			}
			resolve();
		})
	},
	get: function(key) {
		var self = this;
		return new Promise(function(resolve, reject) {
			rc.get(key, function(err, value) {
				if (err) reject(err);
				resolve(JSON.parse(value));
			})
		})
	}
});

util.extend(cache, {
	instance: null,
	getInstance: function() {
		if (!cache.instance) {
			cache.instance = new cache();
		}
		return cache.instance;
	}
});

module.exports = cache.getInstance();