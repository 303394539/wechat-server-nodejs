var util = require("./util");

var _WEEK_NAMES = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
var _MONTH_NAMES = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

module.exports = {
	getTime: function(){
		return new Date().getTime();
	},
	format: function(formatStr, fn){
		var date = new Date();
		var args = {
			y: date.getFullYear(),
			m: date.getMonth() + 1,
			M: _MONTH_NAMES[date.getMonth()],
			d: date.getDate(),
			h: date.getHours() % 12,
			H: date.getHours(),
			i: date.getMinutes(),
			s: date.getSeconds(),
			S: date.getMilliseconds(),
			w: date.getDay(),
			W: _WEEK_NAMES[date.getDay()]
		};
		util.each(args, function(value, key){
			if (new RegExp("(" + key + "{1,4})").test(formatStr)) {
				var e = RegExp.$1,
					f = e.length,
					g = (f > 1 ? "000" : "") + value;
				f > 1 && (g = g.substring(g.length - f)), fn && (g = fn(key, value, g)), formatStr = formatStr.replace(e, g)
			}
		})
		return formatStr;
	},
	getDBTime: function(){
		return this.format("yyyy-mm-dd HH:ii:ss");
	},
	getTimestamp: function(){
		return Math.floor(this.getTime() / 1000);
	}
}