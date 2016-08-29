module.exports = {
	PORT: 10001,
	APPID: 'wx19d23eaae7c697cf',
	APPSECRET: 'd4624c36b6795d1d99dcf0547af5443d',
	HOSTNAME: '1.app.bighante.com',
	PROTOCOL: 'http://',
	DB_CONFIG: {
		host: '127.0.0.1',
		port: 3306,
		user: 'root',
		password: '123456',
		database: 'appdb',
		charset: 'utf8',
		connectionLimit: 10,
		dateStrings: 'datetime',
		supportBigNumbers: true,
		bigNumberStrings: true
	},
	LOG4JS_CONFIG: {
		appenders: [{
			type: 'console',
			category: 'console'
		}, {
			type: 'dateFile',
			filename: __dirname + '/logs/log4js-all',
			pattern: "_yyyy-MM-dd.log",
			alwaysIncludePattern: true,
			category: 'logAll'
		},{
			type: 'dateFile',
			filename: __dirname + '/logs/log4js-debug',
			pattern: "_yyyy-MM-dd.log",
			alwaysIncludePattern: true,
			category: 'logDebug'
		}, {
			type: 'dateFile',
			filename: __dirname + '/logs/log4js-info',
			pattern: "_yyyy-MM-dd.log",
			alwaysIncludePattern: true,
			category: 'logInfo'
		}, {
			type: 'dateFile',
			filename: __dirname + '/logs/log4js-warn',
			pattern: "_yyyy-MM-dd.log",
			alwaysIncludePattern: true,
			category: 'logWarn'
		}, {
			type: 'dateFile',
			filename: __dirname + '/logs/log4js-error',
			pattern: "_yyyy-MM-dd.log",
			alwaysIncludePattern: true,
			category: 'logErr'
		}],
		replaceConsole: true
	}
}
