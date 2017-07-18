import Vue from 'vue'
import Calendar from '../component/calendar/index.vue'
import Calendar2 from '../component/calendar/index2.vue'
import calendarBase from '../component/calendar/base.js'

import './index.scss'

var app = new Vue({
	el: '#app',
  components:{
    'calendar':Calendar,
    'calendar2':Calendar2
  },
	data:function(){
		return {
			name:"h",
			showCalendar:-1,
			showcalendartwo:-1,
			curDay:calendarBase.dateToStr(new Date()),
			target:null
		}
	},
	methods:{
		showCalendarFun:function(e){
			this.showcalendartwo = -1;
			this.showCalendar = 1;
			this.target = e.target;
			this.curDay = (e.target.value)?e.target.value:calendarBase.dateToStr(new Date()) ;
			this.$refs.calendar.reset(this.curDay,e.target.offsetLeft,e.target.offsetHeight+e.target.offsetTop);
		},
		chooseday:function(chooseDate){
			this.showCalendar = -1;
			//this.curDay = chooseDate;
			this.target.value = chooseDate;
		},
		choosedays:function(startDay,endDay){
			this.showcalendartwo = -1;
			//this.curDay = chooseDate;
			this.target.value = startDay+"至"+endDay;
		},
		testFun1:function(){
			console.log("testFun1");
		},
		testFun2:function(){
			console.log("testFun2");
		},
		showCalendarFun2:function(e){
			this.showCalendar = -1;
			this.showcalendartwo = 1;
			this.target = e.target;
			var val = this.target.value;
			this.$refs.calendar2.reset(val,e.target.offsetLeft,e.target.offsetHeight+e.target.offsetTop);
		},
	}
})



