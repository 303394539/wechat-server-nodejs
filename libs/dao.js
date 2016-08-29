var Promise = require("promise");
var mysql = require("./mysql");
var log = require("./log");
var util = require("./util");
var time = require("./time");

var SQL_EXP = /\$\{\s*(.*?)\s*\}/g,
		BOOLEAN_EXP = /^([\w\.]+)\s*(\?\s*([^:]*?))?\s*(\:\s*(.*))?$/;

function _error(err, sql, args){
	log.error("<<< dao.js >>> ("+ time.format("yyyy-mm-dd HH:ii:ss") +") ============================================")
	log.error("sql:" + sql);
	log.error("args:" + JSON.stringify(args));
	log.error(err);
}

function _rejectErrorWithEmptyArray(err, sql, args){
	_error(err, sql, args);
	return Promise.reject([])
}

function _rejectErrorWithNull(err, sql, args){
	_error(err, sql, args);
	return Promise.reject(null)
}

function _getModel(model, data){
	model = require('../model/' + model);
	return model.serializable(data);
}

function _isUndefined(obj){
	return typeof obj === 'undefined';
}

function _getSaveArgs(obj){
	var json = obj.toJson();
	if(!obj.getTablename()){
		return null;
	}
	util.each(json, function(value, key){
		if(!value){
			delete json[key];
			return;
		}
	})
	var sql = "insert into ${tablename} (${values}) value (${placeholders});";
	var values = [];
	var placeholders = [];
	var args = [];
	util.map(json, function(value, key){
		values.push(key);
		placeholders.push("?");
		args.push(value)
	})
	if(values.length <= 0 || placeholders.length <= 0 || args.length <= 0){
		return null;
	}
	var result = {
					sql: sql.replace("${tablename}", obj.getTablename())
										.replace("${values}", values.join(","))
										.replace("${placeholders}", placeholders.join(",")),
					args: args
				};
	log.info("saveSqlObj:("+ time.getDBTime() +")" + JSON.stringify(result));
	return result;
}

function _getUpdateArgs(obj, sqlExp){
	var args = [];
  sqlExp = sqlExp.replace(SQL_EXP, function(matched, str){
		var arr = str.match(BOOLEAN_EXP);
		var value = obj[arr[1]]
		args.push((value ? arr[3] : arr[5]) || value);
    return "?"
  })
  var result = {
  	sql: sqlExp,
  	args: args
  };
  log.info("updateSqlObj:("+ time.getDBTime() +")" + JSON.stringify(result));
  return result;
}

module.exports = {
	execute: function(sql, args){
		return mysql.query(sql, args).then(function(data){
			return Promise.resolve(data)
		}).catch(function(err){
			return _rejectErrorWithEmptyArray(err, sql, args)
		})
	},
	executeInsertGetKey: function(sql, args){
		return mysql.query(sql, args).then(function(data){
			return Promise.resolve(data.insertId)
		}).catch(function(err){
			return _rejectErrorWithNull(err, sql, args)
		})
	},
	queryForObject: function(model, sql, args){
		return mysql.query(sql, args).then(function(data){
			if(!data || data.length == 0){
				return Promise.resolve()
			}
			return Promise.resolve(_getModel(model, data[0]));
		}).catch(function(err){
			return _rejectErrorWithNull(err, sql, args)
		})
	},
	queryForList: function(model, sql, args){
		return mysql.query(sql, args).then(function(data){
			if(!data || data.length == 0){
				return Promise.resolve()
			}
			var result = [];
			util.each(data, function(item){
				console.log(item);
				result.push(_getModel(model, item))
			})
			return Promise.resolve(result);
		}).catch(function(err){
			return _rejectErrorWithNull(err, sql, args)
		})
	},
	queryOneRowOneCol: function(sql, args){
		return mysql.query(sql, args).then(function(data){
			if(!data || data.length == 0){
				return Promise.resolve()
			}
			var result;
			util.each(data[0], function(value){
				if(_isUndefined(result)) result = value;
			})
			return Promise.resolve(result);
		}).catch(function(err){
			return _rejectErrorWithNull(err, sql, args)
		})
	},
	queryForColumnList: function(sql, args){
		return mysql.query(sql, args).then(function(data){
			if(!data || data.length == 0){
				return Promise.resolve()
			}
			var result = [];
			util.each(data, function(item){
				var cache;
				util.each(item, function(value, key){
					if(_isUndefined(result)) cache = {key: value};
				})
				result.push(cache)
			})
			return Promise.resolve(result);
		}).catch(function(err){
			return _rejectErrorWithNull(err, sql, args)
		})
	},
	executeTransactionMap: function(map){
		return mysql.tranMap(map).then(function(data){
			return Promise.resolve(data);
		}).catch(function(err){
			return _rejectErrorWithNull(err, sql, args)
		})
	},
	executeTransactionList: function(list){
		return mysql.tranList(list).then(function(data){
			return Promise.resolve(data);
		}).catch(function(err){
			return _rejectErrorWithNull(err, sql, args)
		})
	},
	save: function(obj){
		var sqlObj = _getSaveArgs(obj);
		if(!sqlObj){
			return Promise.reject();
		}else{
			return this.execute(sqlObj.sql, sqlObj.args);
		}
	},
	update: function(obj, sqlExp, args){
		var sqlObj = _getUpdateArgs(obj, sqlExp);
		if(!sqlObj){
			return Promise.reject();
		}else{
			return this.execute(sqlObj.sql, args || sqlObj.args);
		}
	}
}
