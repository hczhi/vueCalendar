<template>
<div class="container" v-bind:class='{"show":showcalendartwo==1}'  v-bind:style="{ left: left+ 'px', top: top + 'px' }">
  <div class="top">
    <div class="close">
       <div>关闭</div>
    </div>
    <span class="weekend">日</span>
    <span class="">一</span>
    <span class="">二</span>
    <span class="">三</span>
    <span class="">四</span>
    <span class="">五</span>
    <span class="weekend">六</span>
  </div>
  <div class="clearfix containerBox">
    <div class="month_year">
      <i class="iconfont icon-top" v-on:click="preMonth">&#xe605;</i>
      <div class="month">{{month}}月</div>
      <div class="year">{{year}}年</div>
      <i class="iconfont icon-bottom" v-on:click="nextMonth">&#xe601;</i>
    </div>
    <div class="dateBox">
      <table style="height: 300px;" cellspacing=0 cellpadding=0>
        <tr v-for="(weeks,w_index) in calendarData.data">
          <td  v-for="(day,d_index) in weeks" v-bind:class='{"nullbox":day==null,"forBit":day&&day.forBit,"choose":day&&day.ischoose}' v-on:click="clickFun(w_index,d_index)">
            <div v-if="day" class="dayBox">
              <div class="d1">{{day.day}}</div>
              <span class="holiday" v-if="day.istoday">今天</span>
              <div class="price"></div>
              <span></span>
            </div>
          </td>
        </tr>
        </table>
    </div>
  </div>
</div>
</template>

<script>

import base from './base.js'
import createCalendar from './createCalendar.js'
const date = new Date();
const today = new Date(date.getFullYear(),date.getMonth(),date.getDate());

  export default {
    data() {
      return {
          calendarData:[],  //日历数据
          year:'',
          month:'',
          date:'',
          date:null,
          startDay:null,
          endDay:null
        }
    },
    props: ['datestr','showcalendartwo'],
    mounted:function(){
      //
      this.date = base.strToDate(this.datestr);
      this.init(this.datestr);
    },
    methods: {
      init:function(datestr){
          this.calendarData = createCalendar.calendarData(datestr)[0];
          this.year = this.calendarData.year;
          this.month = base.formatNum( this.calendarData.month+1);
          this.showToday();
          this.forBitBeforeToday();
          if(this.startDay){
            this.setStartDay(this.startDay,true);
            this.setChooseDays();
          }
      },
      reset:function(val,left,top){
        val = val.split("至");
        if(val.length==2){
          this.startDay = base.strToDate(val[0]);
          this.endDay = base.strToDate(val[1]);
        }else{
          this.startDay = today;
          this.endDay = null;
        }

        this.datestr = base.dateToStr(this.startDay);
        this.date = this.chooseDate = base.strToDate(this.datestr);
        this.left = left;
        this.top = top;
        console.log(val[1])
        this.init(this.datestr);
      },
      showToday:function(){
          createCalendar.showToday(this.calendarData);
      },
      nextMonth:function(){
        this.date  = base.nextMonth(this.date);
        this.init(base.dateToStr(this.date ));
        // this.init();
      },
      preMonth:function(){
        this.date  = base.preMonth(this.date);
        this.init(base.dateToStr(this.date ));
      },
      forBitBeforeToday:function(){
          createCalendar.forBitBeforeDay(this.calendarData,today);
      },
      clickFun:function(w_index,d_index){
        if(this.calendarData.data[w_index][d_index] == null||this.calendarData.data[w_index][d_index].forBit){
          return false;
        }
        //console.log(this.startDay.getTime());
        var clickDay = this.calendarData.data[w_index][d_index];

        if(this.startDay!=null&&this.endDay!=null){
          this.startDay = new Date(clickDay.time);
          this.endDay = null;
          this.setStartDay(this.startDay,true);
          return;

        }
        if(this.startDay==null){
           this.startDay = new Date(clickDay.time);
           this.endDay = null;
           this.setStartDay(this.startDay,true);
            return;
        }
        if(this.startDay!=null&&this.endDay==null){
            if(this.startDay.getTime()>clickDay.time){
              this.endDay = this.startDay;
              this.startDay = new Date(clickDay.time);
            }
            if(this.startDay.getTime()<clickDay.time){
              this.endDay = new Date(clickDay.time);
            }

            this.setChooseDays();
            var that = this;
            setTimeout(function(){

              that.callback();
            },300);
             return;
        }
        // this.setChoose(this.chooseDate,false);
        // var target = this.calendarData.data[w_index][d_index];
        // this.chooseDate = base.strToDate(this.year+'-'+this.month+'-'+target.day);
        // this.setChoose(this.chooseDate,true);
      },
      setChooseDays:function(){
        if(this.startDay&&this.endDay){
          var startDayTime = this.startDay.getTime(),endDayTime = this.endDay.getTime();
          var time = false;
          for(var i = 0 ; i <this.calendarData.data.length ; i++){
            for(var j = 0 ; j<7 ; j++){
              if( this.calendarData.data[i][j]==null){
                continue;
              }
              time = this.calendarData.data[i][j].time || false;
              if(time<=endDayTime&&time>=startDayTime){
                this.calendarData.data[i][j].ischoose = true;
              }else{
                 this.calendarData.data[i][j].ischoose = false;
              }
            }
          }
        }
        // this.callback();
      },
      callback:function(){
        this.$emit('choosedays',base.dateToStr(this.startDay),base.dateToStr(this.endDay));
      },
      setStartDay:function(date,type){
        var _date = date,
            year = _date.getFullYear(),
            month = _date.getMonth(),
            day = _date.getDate();
          for(var i = 0 ; i <this.calendarData.data.length ; i++){
            for(var j = 0 ; j<7 ; j++){
              if( this.calendarData.data[i][j]==null){
                continue;
              }
               this.calendarData.data[i][j].ischoose = false;
            }
          }
          if (this.calendarData.year == year && this.calendarData.month == month) {
            var f_day = base.monthFirstDay(_date).getDay(),
                i_weeks = Math.ceil((day + f_day) / 7);
            this.calendarData.data[i_weeks - 1][_date.getDay()].ischoose = type;
          }
      } 
    }
  }

</script>

<style lang="scss" scoped>
  .clearfix:after{
        visibility: hidden;
        display: block;
        font-size: 0;
        content: " ";
        clear: both;
        height: 0;
  }
  .container{
        width: 635px;
        background: #fff;
        box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.2);
        display: none;
        .top{
            height: 50px;
            line-height: 50px;
            border-bottom: 1px solid #dddddd;
            .close{
                  display: inline-block;
                  width: 75px;
                  div{
                      border: 1px solid #ddd;
                      font-size: 14px;
                      color: #616161;
                      border-radius: 4px;
                      width: 70px;
                      height: 30px;
                      text-align: center;
                      position: relative;
                      left: 6px;
                      line-height: 30px;
                      cursor: pointer;
                  }
            }
            span{
                  width: 75px;
                  display: inline-block;
                  text-align: center;
            }
            .weekend{
                color: #f88529 !important;
                font-weight: bold !important;
            }
        }
        .containerBox{
          .month_year{
                  width: 79px;
                  float: left;
                  height: 296px;
                  position: relative;
            .icon-top{
                  position: absolute;
                  font-size: 24px;
                  width: 79px;
                  text-align: center;
                  left: 0;
                  top: 20px;
                  cursor: pointer;
                  color: #ccc;
            }
            .icon-bottom{
                  position: absolute;
                  font-size: 24px;
                  left: 0;
                  width: 79px;
                  text-align: center;
                  bottom: 20px;
                  cursor: pointer;
                  color: #ccc;
            }
           .month {
                position: absolute;
                font-size: 20px;
                left: 0;
                width: 79px;
                text-align: center;
                top: 120px;
                color: #333;
            }
            .year {
                position: absolute;
                font-size: 14px;
                left: 0;
                width: 79px;
                text-align: center;
                top: 150px;
                color: #333;
            }
          }
          .dateBox{
                width: 555px;
                float: left;
                overflow: hidden;
                border-left: 1px solid #ddd;
                table{
                  width: 100%;
                  font-size: 12px;
                }
                td{
                      border-bottom: 1px solid #ddd;
                      position: relative;
                      padding: 0px 0;
                      border-right: 1px solid #ddd;
                      cursor: pointer;
                      width: 80px;
                      height: 49px;
                }
                td:nth-child(7){
                      border-right: 0px;
                }
                tr:last-child td{
                      border-bottom: 0px;
                }
                .nullbox,.forBit{
                  cursor: default;
                  .d1{
                    color: #999;
                  }
                }
                .dayBox{
                  position: relative;
                  width: 100%;
                  height: 100%;
                }
                .d1{
                      position: absolute;
                      top: 5px;
                      left: 5px;
                      color: #139ae8;
                }
                .holiday{
                      position: absolute;
                      top: 5px;
                      right: 5px;
                      color: #999;
                }
                .choose{
                  background: #ffefcd;
                }
          }
        }
  }
    .show{
    display: block;
  }
</style>













