var util = require('./util');

function _extends(obj) {
	var object = function() {
		if (this.__needinit__) {
			this.init.apply(this, arguments)
		}
	}
	this.prototype.__needinit__ = 0;
	var prototype = new this();
	this.prototype.__needinit__ = 1;
	var privateValue = [];
	var immutable = [];
	var primaryKey;
	var tablename;
	util.each((typeof obj === 'function' ? obj() : obj), function(value, key){
		switch (key) {
			case "__superclass__":
			case "__class__":
			case "__needinit__":
				break;
			case "static":
				util.extend(object, value)
				break;
			case "tablename":
				tablename = value;
				break;
			case "primaryKey":
				primaryKey = value;
				break;
			case "immutable":
				immutable = immutable.concat(value);
				break;
			default:
				prototype[key] = value
				if(typeof value !== 'function')privateValue.push(key)
		}
	})
	util.extend(prototype, {
		__tablename__: tablename,
		__superclass__: this,
		__class__: object,
		__privateValue__: privateValue,
		__immutable__: immutable,
		__primaryKey__: primaryKey,
		constructor: object,
		toJson: function(){
			var json = {};
			var self = this;
			this.__privateValue__.forEach(function(key){
				var value = self[key];
				json[key] = typeof value === 'undefined' ? null : value;
			})
			return json;
		},
		toString: function(){
			return JSON.stringify(this.toJson());
		},
		getTablename: function(){
			return this.__tablename__;
		},
		get: function(key){
			return this[key];
		},
		set: function(key, value){
			this[key] = value;
		},
		init: prototype.init || function(){}
	})

	object.prototype = prototype
	util.extend(object, {
		__superclass__: prototype,
		extends: _extends,
		create: function() {
			this.prototype.__needinit__ = 0;
			var obj = new this();
			this.prototype.__needinit__ = 1;
			obj.init.apply(obj, arguments);
			return obj
		},
		serializable: function(data){
			var obj = this.create();
			var cache = {};
			obj.__proto__.__privateValue__.forEach(function(item){
				if(data[item]) cache[item] = data[item];
			})
			util.each(cache, function(value, key){
				obj.set(key, value)
			})
			return obj;
		}
	})
	return object
}

Object.extends = _extends;

module.exports = Object;
