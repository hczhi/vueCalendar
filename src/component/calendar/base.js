var base = {
	author: "hc",
	isDate: function(value) {
		return Object.prototype.toString.call(value) === '[object Date]';
	},
	/*
	 * Date对象转字符串
	 * @param date 要转换的Date对象
	 * @param pattern 字符串格式模板，其中字符"y"、"M"、"d"、"h"、"m"、"s"、"w"、"q"、"S"会被替代成日期对应的数值，长度由字符数决定
	 * @return 满足pattern格式的字符串
	 * 例：
	 * pattern 为 "yyyy-MM-dd"，则返回如 "2015-08-18"
	 * pattern 为 "yyyy-MM-dd hh:mm:ss"，则返回如 "2015-08-18 09:41:13"
	 * pattern 为 "yyyy-MM-dd hh:mm:ss"，则返回如 "2015-08-18 09:41:13"
	 * pattern 为 "yyyy-MM-dd hh:mm:ss +(S)"，则返回如 "2015-08-18 09:43:44 +(902)"
	 * pattern 为 "yy年第q季度"，则返回如 "15年第3季度"
	 * pattern 为 "今天是星期w"，则返回如 "今天是星期二"
	 * */
	dateToStr: function(date, pattern) {
		// if (this.isStr(date)) {
		// 	return date;
		// }

		var pattern = pattern || 'yyyy-MM-dd';

		var o = {
			"M+": date.getMonth() + 1, //month 从 Date 对象返回月份 (0 ~ 11)，加以改成1~12月份
			"d+": date.getDate(), //day 从 Date 对象返回一个月中的某一天 (1 ~ 31)。
			"h+": date.getHours(), //hour 返回 Date 对象的小时 (0 ~ 23)。
			"m+": date.getMinutes(), //minute  返回 Date 对象的分钟 (0 ~ 59)。
			"s+": date.getSeconds(), //second 返回 Date 对象的秒数 (0 ~ 59)。
			"w+": "\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".charAt(date.getDay()), //“日一二三四五六”中的某一个
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度
			"S": date.getMilliseconds() //Date 对象的毫秒(0 ~ 999)。
		};

		//将"yyyy-MM-dd"中的"y"替换成具体年份，并根据"y"的数量保留对应的位数
		if (new RegExp("(y+)").test(pattern)) {
			pattern = pattern.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		}

		//替换剩下的模板，如果有的模板长度大于1，如"yyyy-MM-dd"中的"MM"、"dd"，则定为两位，实际字符串长度不足两位的，前面用0补足
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(pattern)) {
				pattern = pattern.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			}
		}

		return pattern;
	},
	/*
	 * 字符串转换成Date对象
	 * @param str 要转换的字符串
	 * @param delimiter 字符串年月日分隔符，默认为 "-"
	 * @param pattern 字符串年月日模板（年月日的索引对应字符串按delimiter分割后的数组索引）
	 * @return 日期对象
	 * 例：
	 * app.strToDate('2015-03-28') 返回Sat Mar 28 2015 00:00:00 GMT+0800 (中国标准时间) 的Date对象
	 * app.strToDate('2015/03/28', '/') 返回Sat Mar 28 2015 00:00:00 GMT+0800 (中国标准时间) 的Date对象
	 * app.strToDate('03/28/2015', '/', 'mdy') 返回Sat Mar 28 2015 00:00:00 GMT+0800 (中国标准时间) 的Date对象
	 * */
	strToDate: function(str, delimiter, pattern) {
		if (this.isDate(str)) {
			return str;
		}

		delimiter = delimiter || "-";
		pattern = pattern || "ymd";
		var a = str.split(delimiter); //当前字符串值的年月日数组
		var y = parseInt(a[pattern.indexOf("y")], 10); //年的整数值

		//如果年的值小，则为20xx年
		if (y.toString().length <= 2) {
			y += 2000;
		}

		//如果年不是数字，则取当前年
		if (isNaN(y)) {
			y = new Date().getFullYear();
		}

		var m = parseInt(a[pattern.indexOf("m")], 10) - 1; //月为字符串月的整数值减一，变成下班从0开始

		var d = parseInt(a[pattern.indexOf("d")], 10); //字符串日的整数值

		//如果日不是数字，则是1日
		if (isNaN(d)) {
			d = 1;
		}

		return new Date(y, m, d);
	},
	addDay: function(date, n) {
		return new Date(date.getTime() + (n || 0) * 86400000); // 86400000 == 24 * 60 * 60 * 1000
	},
	// 返回date所在月份的后面第n个月，
	addMonth: function(date, n) {
		return new Date(date.getFullYear(), date.getMonth() + (n || 0), 1);
	},
	yearFirstDay: function(date) {
		return new Date(date.getFullYear(), 0, 1);
	},

	yearLastDay: function(date) {
		return new Date(date.getFullYear(), 12, 0);
	},
	monthFirstDay: function(date) {
		return new Date(date.getFullYear(), date.getMonth(), 1);
	},

	monthLastDay: function(date) {
		return new Date(date.getFullYear(), date.getMonth() + 1, 0);
	},

	nextMonth: function(date) {
		return new Date(date.getFullYear(), date.getMonth() + 1, 1);
	},
	preMonth: function(date) {
		return new Date(date.getFullYear(), date.getMonth() - 1, 1);
	},
	getWeekCounts:function(date){
		var first = this.monthFirstDay(date).getDate();
        var last = this.monthLastDay(date).getDate();
        return Math.ceil((first + last) / 7);
	},
	formatNum :function(num) {
        if (num < 10) {
            num = "0" + num;
        } else {
        	num = "" + num;
        }
        return num.toString();
    }
}

module.exports = base;