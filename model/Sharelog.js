var oop = require("../libs/oop");

var Sharelog = oop.extends({
	uuid: "",
	openid: "",
	superid: "",
	scene: 0,
	url: "",
	createtime: "",
	tablename: "share_log",
	primaryKey: "uuid"
})

module.exports = Sharelog;