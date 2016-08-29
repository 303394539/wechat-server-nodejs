var oop = require("../libs/oop");

var Subscribelog = oop.extends({
	uuid: "",
	openid: "",
	superid: "",
	createtime: "",
	tablename: "subscribe_log",
	primaryKey: "uuid"
})

module.exports = Subscribelog;