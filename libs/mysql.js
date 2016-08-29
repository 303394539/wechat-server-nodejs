var Promise = require('promise');
var CONFIG = require('../config');
var mysql = require('mysql');
var log = require("./log");
var util = require("./util");

var pool = mysql.createPool(CONFIG.DB_CONFIG);

function _Transaction(obj){
	var self = this;
	if(!obj){
		return Promise.reject();
	}
	if(!Array.isArray){
		obj = [obj];
	}
	return new Promise(function(resolve, reject) {
		self.getConn().then(function(conn) {
			conn.beginTransaction(function(err) {
				if (err) {
					log.error(err)
					reject(err)
				}
				var task = [];
				util.each(obj, function(map){
					task.concat(util.map(map, function(args, sql){
						return new Promise(function(resolve, reject){
							if (!args) args = [];
							if (!Array.isArray(args)) args = [args];
							conn.query(sql, args, function(err, result){
								if(err){
									reject(err)
								}else{
									resolve(result)
								}
							})
						})
					}))
				})
				Promise.all(task).then(function(){
					conn.commit(function(err, result) {
						if (err) {
							log.error(err)
							conn.rollback(reject);
							reject(err)
						} else {
							resolve(result)
						}
					});
				}).catch(function(err){
					log.error(err)
					conn.rollback(reject);
					reject(err)
				})
			})
		}).catch(function(e) {
			log.error(e)
		})
	})
}

module.exports = {
	getConn: function() {
		return new Promise(function(resolve, reject) {
			pool.getConnection(function(err, conn) {
				if (err) reject(err);
				resolve(conn);
			})
		})
	},
	query: function(sql, args) {
		var self = this;
		if (!args) args = [];
		if (!Array.isArray(args)) args = [args];
		return new Promise(function(resolve, reject) {
			self.getConn().then(function(conn) {
				conn.query(sql, args, function(err, result) {
					conn.release();
					if (err) reject(err)
					resolve(result);
				})
			}).catch(function(e) {
				log.error(e)
			})
		})
	},
	tranMap: _Transaction,
	tranList: _Transaction
}
