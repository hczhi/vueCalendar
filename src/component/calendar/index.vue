<template>
<div class="container" v-bind:class='{"show":showcalendar==1}'  v-bind:style="{ left: left+ 'px', top: top + 'px' }">
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
          left:0,
          top:0,
          date:null,
          chooseDate:null
        }
    },
    props: ['datestr','showcalendar'],
    mounted:function(){
      //
      this.date = this.chooseDate = base.strToDate(this.datestr);
      this.init(this.datestr);
    },
    methods: {
      init:function(datestr){
          this.calendarData = createCalendar.calendarData(datestr)[0];
          this.year = this.calendarData.year;
          this.month = base.formatNum( this.calendarData.month+1);
          this.showToday();
          this.forBitBeforeToday();
          this.setChoose(this.chooseDate,true);
      },
      reset:function(datestr,left,top){
        console.log(datestr)
        this.datestr = datestr;
        this.date = this.chooseDate = base.strToDate(this.datestr);
        this.left = left;
        this.top = top;
        this.init(datestr);
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
        this.setChoose(this.chooseDate,false);
        var target = this.calendarData.data[w_index][d_index];
        this.chooseDate = base.strToDate(this.year+'-'+this.month+'-'+target.day);
        this.setChoose(this.chooseDate,true);

        this.callback();
      },
      callback:function(){
        this.$emit('chooseday',  base.dateToStr(this.chooseDate) );
      },
      setChoose:function(date,type){
        var _date = date,
            year = _date.getFullYear(),
            month = _date.getMonth(),
            day = _date.getDate();
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
                      &:hover{
                        background: #fbf6ea;
                      }
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













