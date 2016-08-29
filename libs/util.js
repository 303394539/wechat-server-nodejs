var Promise = require("promise");

function _hasOwn(object, property){
	return Object.prototype.hasOwnProperty.call(object, property);
}

function _isPlainObject(obj) {
	if (typeof obj !== "object") {
		return false;
	}

	if (obj.constructor &&
		!_hasOwn(obj.constructor.prototype, "isPrototypeOf")) {
		return false;
	}

	return true;
}

function _extend() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	if (typeof target === "boolean") {
		deep = target;

		target = arguments[i] || {};
		i++;
	}

	if (typeof target !== "object" && typeof target !== "function") {
		target = {};
	}

	if (i === length) {
		target = this;
		i--;
	}

	for (; i < length; i++) {
		if ((options = arguments[i]) != null) {
			for (name in options) {
				src = target[name];
				copy = options[name];

				if (target === copy) {
					continue;
				}

				if (deep && copy && (_isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && Array.isArray(src) ? src : [];

					} else {
						clone = src && _isPlainObject(src) ? src : {};
					}

					target[name] = _extend(deep, clone, copy);

				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	return target;
}

function _each(obj, fn, scope) {
  if (Array.isArray(obj)) {
    Array.prototype.forEach.apply(obj, Array.prototype.slice.call(arguments, 1));
  } else {
    for (var key in obj)
      if (_hasOwn(obj, key)) {
        fn.call(scope, obj[key], key, this);
      }
  }
}

function _map(obj, fn, scope){
	if (Array.isArray(this)) {
    return Array.prototype.map.apply(obj, Array.prototype.slice.call(arguments, 1));
  } else {
    var result = {};
    _each(obj, function(value, key, object){
    	result[key] = fn.call(scope, value, key, object);
    })
    return result;
  }
}

function _httpGet(url){
  var http = require("http");
  var size = 0;
  var chunks = [];
  return new Promise(function(resolve, reject){
	  http.get(url, function(res){
	    res.on('data', function(chunk) {
	      size += chunk.length;
	      chunks.push(chunk);
	    });
	    res.on("end", function(msg){
	      resolve(JSON.parse(Buffer.concat(chunks, size).toString()))
	    })
	  }).on("error", function(e){
	  	reject(e)
	  })
  })
}

function _httpsGet(url){
  var https = require("https");
  var size = 0;
  var chunks = [];
  return new Promise(function(resolve, reject){
	  https.get(url, function(res){
	    res.on('data', function(chunk) {
	      size += chunk.length;
	      chunks.push(chunk);
	    });
	    res.on("end", function(msg){
	      resolve(JSON.parse(Buffer.concat(chunks, size).toString()))
	    })
	  }).on("error", function(e){
	  	reject(e)
	  })
  })
}

function _random(min, max) {
	var rand = Math.floor(min + Math.random() * (max - min));
	rand = isNaN(rand) ? (function(a, b) {
		(typeof b != "undefined") || (b = a, a = 0);
		var c = b - a,
			e = Math.random();
		return a + e * c | 0
	})(min || 9999999) : rand;
	return rand;
}

function _responseCookies(res, obj, options){
	var opts = _extend({
		maxAge: 1000 * 60 * 60
	}, options);
	_each(obj, function(value, key){
		var _opts = opts;
		if(value.opts && value.value){
			_opts = _extend({}, value.opts, opts);
			value = value.value;
		}
		res.cookie(key, value, _opts)
	})
	return res;
}

module.exports = {
	httpGet: _httpGet,
	httpsGet: _httpsGet,
	extend: _extend,
	hasOwn: _hasOwn,
	each: _each,
	map: _map,
	random: _random,
	responseCookies: _responseCookies
}