<template>
  <el-form v-loading="loading">
 <div class="fh-calendar">
   <div class="fh-calendar-content">
     <div v-if="showHead" class="fh-calendar-content-header">
       <el-button size="mini" type="primary" round @click="toToday">今天</el-button>
       <el-button size="mini" type="primary" round @click="preMonth">上一月</el-button>
       <el-date-picker
         v-model="date"
         type="month"
         :editable="false"
         prefix-icon=""
         :clearable = "false"
         format="yyyy 年 MM 月"
         value-format="yyyy-MM"
         align="center"
         unselectable="on"
       >
       </el-date-picker>
       <el-button size="mini" type="primary" round @click="nextMonth">下一月</el-button>
       <el-button size="mini" type="primary" round @click="refresh">刷新</el-button>
     </div>
     <div class="fh-calendar-content-body">
       <table class="fh-calendar-content-body-table">
         <thead>
          <tr>
            <th><div class="fh-table-week work">一</div></th>
            <th><div class="fh-table-week work">二</div></th>
            <th><div class="fh-table-week work">三</div></th>
            <th><div class="fh-table-week work">四</div></th>
            <th><div class="fh-table-week work">五</div></th>
            <th><div class="fh-table-week weekend">六</div></th>
            <th><div class="fh-table-week weekend">日</div></th>
          </tr>
         </thead>
         <tbody>
          <template  v-for="row in [1,2,3,4,5,6]">
            <tr v-if="days[row * 7-7] !== undefined">

              <td @click="itemclick(days[row * 7-(8-week)])" v-for="week in [1,2,3,4,5,6,7]" :class="(row % 2 === 1 ? (week % 2 === 1? 'tdbg-gray' : 'tdbg-white'):(week % 2 === 0 ? 'tdbg-gray' : 'tdbg-white')) + ' ' +
               ((days[row * 7-(8-week)] && days[row * 7-(8-week)].year === today.year && days[row * 7-(8-week)].month === today.month && days[row * 7-(8-week)].day === today.day) ? 'today':'') + ' '
               + ((days[row * 7-(8-week)] && days[row * 7-(8-week)].year === defaultDateObj.year && days[row * 7-(8-week)].month === defaultDateObj.month && days[row * 7-(8-week)].day === defaultDateObj.day) ? 'selectedDay':'')
                ">

                <template v-if="days[row * 7-(8-week)]" v-for="item in [days[row * 7-(8-week)]]">
                  <div style="height: 100%;">
                    <div class="calendar-extend-work-or-rest-box" v-html="workOrRestDict(item.year,item.month,item.day)">
                    </div>
                    <div :class="'day ' + (week > 5 ? 'red' : '')">{{item.day}}</div>
                    <div class="lunar-day" v-html="lunarDay(item)"></div>
                  </div>
                </template>
              </td>
            </tr>
          </template>
         </tbody>
       </table>
     </div>
   </div>
 </div>
  </el-form>
</template>

<script>
  import { getDictByValueSync } from '@/utils/dictUtils.js'
  export default {
    name: 'SelfCalendar',
    props: {
      // 年月日 yyyy-MM-dd
      defaultDate: {
        default: null
      },
      showHead: {
        default: true
      }
    },
    data () {
      return {
        loading: false,
        // yyyy-MM 显示的月份
        date: null,
        days: [],
        calendarExtends: []
      }
    },
    computed: {
      today () {
        let date = new Date()
        return {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
        }
      },
      defaultDateObj () {
        if (this.defaultDate) {
          let dateStr = this.defaultDate.split('-')
          return {
            year: parseInt(dateStr[0]),
            month: parseInt(dateStr[1]),
            day: parseInt(dateStr[2])
          }
        }
        return {}
      }
    },
    mounted () {
      // this.toToday()
      this.init(this.defaultDate)
    },
    methods: {
      loadData (date) {
        let self = this
        let dateArray = date.split('-')
        self.$http.get('/base/calendarextends', {year: dateArray[0], month: dateArray[1]})
          .then(res => {
            let content = res.data.data.content
            self.calendarExtends = content
          }).catch(() => {
            return Promise.resolve()
          }).then(() => {
            self.loading = true
            self.$http.get('/base/calendar/' + date + '/dates').then(
              res => {
                let content = res.data.data.content
                self.days = content
                let firstDay = self.days[0]
                let firstDayWeek = firstDay.week
                if (firstDayWeek === 0) {
                  firstDayWeek = 7
                }
                for (let i = 0; i < firstDayWeek - 1; i++) {
                  self.days.unshift(null)
                }
                self.loading = false
              }).catch(() => {
                self.$message.error('加载日历失败，请重试')
                self.loading = false
              })
          })
      },
      lunarDay (item) {
        let color = ''
        let r = item.lunarMonthStr + '月' + item.lunarDayStr
        if (item.currentLeap && item.leapMonth === item.lunarMonth) {
          r = '闰' + r
        }
        if (this.calendarExtends && this.calendarExtends.length > 0) {
          for (let i = 0; i < this.calendarExtends.length; i++) {
            let _item = this.calendarExtends[i]
            if (_item.year === item.year && _item.month === item.month && _item.day === item.day && _item.holiday !== '' && _item.holiday !== null) {
              r = _item.holiday
              color = '#FF653E'
              break
            }
          }
        }
        if (!color) {
          if (item.traditionalFestival) {
            r = item.traditionalFestival
            color = '#FF653E'
          } else if (item.solarHoliday) {
            r = item.solarHoliday
            color = '#FF653E'
          } else if (item.solarTerm24) {
            r = item.solarTerm24
            color = '#2D97DE'
          } else if (item.weekSolarHoliday) {
            r = item.weekSolarHoliday
            color = '#FF653E'
          }
        }

        if (color) {
          r = '<span style="color:' + color + '">' + r + '</span>'
        } else {
          r = '<span>' + r + '</span>'
        }

        return r
      },
      toToday () {
        this.date = this.today.year + '-' + this.today.month
      },
      addMonth (num) {
        let d = new Date(this.date + '-01')
        d.setMonth(d.getMonth() + num)
        this.date = d.getFullYear() + '-' + (d.getMonth() + 1)
      },
      nextMonth () {
        this.addMonth(1)
      },
      preMonth () {
        this.addMonth(-1)
      },
      itemclick (item) {
        this.$emit('itemclick', item)
      },
      init (defaultDate) {
        if (defaultDate) {
          let _defaultDate = defaultDate.substring(0, defaultDate.lastIndexOf('-'))
          this.date = _defaultDate
        } else {
          this.toToday()
        }
      },
      refresh () {
        this.loadData(this.date)
      },
      workOrRestDict (year, month, day) {
        if (this.calendarExtends && this.calendarExtends.length > 0) {
          for (let i = 0; i < this.calendarExtends.length; i++) {
            let item = this.calendarExtends[i]
            if (item.year === year && item.month === month && item.day === day) {
              let dict = getDictByValueSync(this, 'work_or_rest', item.workOrRest)
              let _class = 'calendar-extend-'
              if (item.workOrRest === 'work') {
                _class += 'work'
              } else if (item.workOrRest === 'rest') {
                _class += 'rest'
              } else {
                _class += 'other'
              }
              return dict ? '<div class="' + _class + '">' + dict.name + '</div>' : null
            }
          }
        } else {
          return null
        }
      }
    },
    watch: {
      date (val) {
        this.loadData(val)
      },
      defaultDate (val) {
        this.init(val)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .fh-calendar{
    padding:1.5em;

  }
  .fh-calendar-content-body-table{
    border-collapse:separate;
    border-spacing:0px;
    margin: 0 auto;
  }
  .fh-calendar-content-body-table th,.fh-calendar-content-body-table td{
    width:6em;
    height:6em;
    text-align: center;
    border: 1px solid transparent;
  }
  .fh-calendar-content-body-table th{
    color:   #fff;
  }
  .fh-calendar-content-body-table th .fh-table-week{

    width: 2em;
    height: 2em;
    line-height: 2em;
    border-radius: 50%;
    margin: 0 auto;
  }
  .fh-calendar-content-body-table th .fh-table-week.work{
    background-color: #3D556D;
  }
  .fh-calendar-content-body-table th .fh-table-week.weekend{
    background-color: #EA8274;
  }
  .fh-calendar-content-body-table td  .day{
    font-size: 1.5em;
  }
  .fh-calendar-content-body-table td .day.red{
    color: #EA8274;
  }
  .fh-calendar-content-body-table td.tdbg-gray{
    background-color: #F7F8F8;
  }
  .fh-calendar-content-body-table td.tdbg-white{
    background-color: #FDFEFE;
  }
  .fh-calendar-content-body-table td:hover{
    background-color: #fff;
    border: 1px solid #A4D2F1;
    border-left: 1px solid #A4D2F1;
  }
  .fh-calendar-content-body-table td.today{
    background-color: #2D97DE;
    color: #fff;
  }
  .fh-calendar-content-body-table td.selectedDay{
    background-color: #fff;
    border: 2px solid #A4D2F1;
    border-left: 2px solid #A4D2F1;
  }
  .fh-calendar-content-header{
    text-align: center;
  }
</style>
<style>
  .fh-calendar-content-header .el-input__prefix, .fh-calendar-content-header .el-input__suffix{
    display: none !important;
  }
  .fh-calendar-content-header .el-input__inner{
    text-align: center;
    padding-left: 0;
    padding-right: 0;
    cursor: pointer;
    color: #2a6496;
    caret-color:transparent;
    border: 0;
  }
  .fh-calendar-content-header .el-date-editor{
    width:110px;
  }


  .calendar-extend-work-or-rest-box{
    position: relative;
  }
  .calendar-extend-work-or-rest-box .calendar-extend-work{
    background-color: #EA8277;
    position: absolute;
    padding:0 0.1em;
    letf: 0;
    top: 0;
    color: #F8FBF5;
  }
  .calendar-extend-work-or-rest-box .calendar-extend-rest{
    background-color: #8AC11B;
    position: absolute;
    padding:0 0.1em;
    letf: 0;
    top: 0;
    color: #F8FBF5;
  }
  .calendar-extend-work-or-rest-box .calendar-extend-other{
    background-color: #EABAB1;
    position: absolute;
    padding:0 0.1em;
    letf: 0;
    top: 0;
    color: #F8FBF5;
  }
</style>
