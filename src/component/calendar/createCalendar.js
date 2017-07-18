import base from './base.js';

const todayDate = new Date();

var createCalendar = {
	author: "hc",
	today: new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate()),
	calendarData: function(dateStr, num) {
		var _data = [],
			date = base.strToDate(dateStr),
			_num = num || 1;

		for (var i = 0; i < _num; i++) {
			var curDate = (i == 0) ? date : base.addMonth(date, i);
			var weeks = Math.ceil((base.monthLastDay(curDate).getDate() + base.monthFirstDay(curDate).getDay()) / 7);
			var firstDay = base.monthFirstDay(curDate).getDay(),
				lastDay = base.monthLastDay(curDate).getDay();
			var year = curDate.getFullYear(),
				month = curDate.getMonth();
			var data = {
				year: year,
				month: month,
				formateDay: base.dateToStr(base.monthFirstDay(curDate)),
				data: []
			};
			for (var j = 0; j < weeks; j++) {
				data.data[j] = [];
				for (var k = 0; k < 7; k++) {
					if ((j == 0 && k < firstDay) || (j == weeks - 1 && k > lastDay)) { //无日期
						data.data[j].push(null);
					} else {
						var day = j * 7 + k + 1 - firstDay;
						data.data[j].push({
							"day": day,
							"time": new Date(year, month, day).getTime(),
							"forBit": false,
							"ischoose": false
						});
					}
				}
			}
			_data.push(data);
		}
		return _data;

	},
	showToday: function(data) {
		var today = this.today,
			year = today.getFullYear(),
			month = today.getMonth(),
			day = today.getDate();
		if (data.year == year && data.month == month) {
			var f_day = base.monthFirstDay(today).getDay(),
				i_weeks = Math.ceil((day + f_day) / 7);
			data.data[i_weeks - 1][today.getDay()].istoday = true;
			return false;
		}
	},
	forBitBeforeDay: function(data, Day) {
		var minDay = Day || this.today,
			time = minDay.getTime();
		var _data = data.data;
		for (var i = 0; i < _data.length; i++) {
			for (var j = 0; 7 > j; j++) {
				if (!_data[i][j]) {
					continue;
				}
				if (_data[i][j].time < time) {
					_data[i][j].forBit = true;
				}
			}
		}
		return _data;
	}
}

// module.exports = createCalendar;
export default createCalendar