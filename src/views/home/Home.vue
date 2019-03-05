<template>
 <div class="warpper home">
   <el-row>
     <el-col :xs="24" :lg="12">
       <el-card class="url-collect">
         <div slot="header" class="clearfix">
           <span>收藏夹</span>
           <el-button type="text" style="padding: 0" @click="refreshUrlCollect">刷新</el-button>
           <el-button style="float: right; padding: 3px 0" type="text" @click.stop="guideUrlCollect">怎么收藏?</el-button>
         </div>
         <url-collect ref="urlcollect"></url-collect>
       </el-card>
     </el-col>

     <el-col :xs="24" :lg="12" style="text-align: center;">
       <el-card class="url-collect">
         <div slot="header" style="text-align: left;">
           <span>日历</span>
         </div>
         <self-calendar style="margin: 0 auto;font-size: 0.85em;"></self-calendar>
       </el-card>
     </el-col>
   </el-row>
 </div>
</template>

<script>
  import SelfCalendar from '@/components/SelfCalendar'
  import UrlCollect from '@/views/home/UrlCollect'
  import * as Driver from 'driver.js' // import driver.js
  import 'driver.js/dist/driver.min.css' // import driver.js css
  import driverConfig from '@/utils/guideDriverConfig.js'
  import $ from 'jquery'
  export default {
    components: {
      UrlCollect,
      SelfCalendar
    },
    name: 'Home',
    data () {
      return {
        guideDriver: null
      }
    },
    mounted () {
      this.guideDriver = new Driver(driverConfig)
    },
    methods: {
      guideUrlCollect () {
        let isShow = $('.guide-url-collect-1').next().is(':visible')
        if (isShow !== true) {
          $('.guide-url-collect-1').click()
        }
        const steps = [
          {
            element: '.guide-url-collect-1',
            popover: {
              title: '1/2',
              description: '点击[操作]按钮',
              position: 'left'
            }
          },
          {
            element: '.guide-url-collect-2',
            popover: {
              title: '1/2',
              description: '点击[收藏]按钮',
              position: 'left'
            }
          }
        ]
        this.guideDriver.defineSteps(steps)
        this.guideDriver.start()
      },
      refreshUrlCollect () {
        this.$refs.urlcollect.loadTableData()
      }
    },
    watch: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.warpper.home{
  padding: 20px;
  height: 100%;
  background-color: #EDEFF2;
  overflow-y: auto;
}
</style>
<style>
  .warpper.home .el-card__body{
    padding: 0;
  }
</style>
