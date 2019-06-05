<template>
  <div class="fh-page-wrapper">
    <div class="fh-padding-30">
    <el-row :gutter="40" class="fh-background-white panel-group">
      <el-col :xs="24" :sm="24" :lg="24" class="card-panel-col">
        <div>
          <div><h3>用户性别比例 <count-to :start-val="0" :end-val="userCountData.allNum || 0" :duration="2600" /></h3></div>

          <SelfECharts :height="'80px'"  :e-charts-options="userCountEChartsOptions"></SelfECharts>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="40" class="fh-background-white  panel-group">
      <el-col :xs="24" :sm="24" :lg="24" class="card-panel-col">
        <div>
          <div><h3>在线用户性别比例 <count-to :start-val="0" :end-val="userCountData.onlineAllNum || 0" :duration="2600" /></h3></div>

          <SelfECharts :height="'80px'"  :e-charts-options="userOnlineCountEChartsOptions"></SelfECharts>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="40" class="fh-background-white  panel-group">
      <el-col :xs="24" :sm="24" :lg="24" class="card-panel-col">
        <div>
          <h3>终端分布</h3>
          <SelfECharts :height="'500px'"  :e-charts-options="userClientEChartsOptions"></SelfECharts>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="40" class="fh-background-white  panel-group">
    <el-col :xs="24" :sm="24" :lg="24" class="card-panel-col">
      <div>
        <h3>用户区域分布</h3>
        <SelfECharts :load-map="true" :height="'500px'"  :e-charts-options="userAreatEChartsOptions"></SelfECharts>
      </div>
    </el-col>
  </el-row>
    <el-row :gutter="40" class="fh-background-white panel-group">
      <el-col :xs="24" :sm="24" :lg="24" class="card-panel-col">
        <div>
          <h3>在线用户区域分布</h3>
          <SelfECharts :load-map="true" :height="'500px'"  :e-charts-options="userOnlineAreatEChartsOptions"></SelfECharts>
        </div>
      </el-col>
    </el-row>
    </div>
  </div>
</template>

<script>
  import CountTo from 'vue-count-to'
  import SelfECharts from '@/components/SelfECharts.vue'
  import SelfBaiDuMap from '@/components/SelfBaiDuMap.vue'
  import EChartsOptionsGenderBar from './EChartsOptionsGenderBar.js'
  import EChartsOptionsClientBar from './EChartsOptionsClientBar.js'
  import EChartsOptionsArea from './EChartsOptionsArea.js'

  export default {
    name: 'UserStatistic',
    components: {
      SelfECharts,
      SelfBaiDuMap,
      CountTo
    },
    data () {
      return {
        userCountData: {},
        userCountEChartsOptions: {},
        userOnlineCountEChartsOptions: {},
        userClientEChartsOptions: {},
        userAreatEChartsOptions: {},
        userOnlineAreatEChartsOptions: {}
      }
    },
    mounted () {
      console.log('UserStatistic mounted')
      this.loadUserCountData()
      this.loadUserClientCountData()
      this.loadUserAreaCountData()
    },
    methods: {
      loadUserCountData () {
        let self = this
        this.$http.get('/statistic/user/count')
          .then(function (res) {
            let content = res.data.data.content
            if (content.length > 0) {
              self.userCountData = content[0]
              let userCountECO = EChartsOptionsGenderBar()
              userCountECO.xAxis.max = self.userCountData.allNum
              userCountECO.series[0].data = [self.userCountData.maleNum]
              userCountECO.series[1].data = [self.userCountData.femaleNum]
              userCountECO.series[2].data = [self.userCountData.genderOtherNum]
              self.userCountEChartsOptions = userCountECO
              let userOnlineCountECO = EChartsOptionsGenderBar()
              userOnlineCountECO.xAxis.max = self.userCountData.onlineAllNum
              userOnlineCountECO.series[0].data = [self.userCountData.onlineMaleNum]
              userOnlineCountECO.series[1].data = [self.userCountData.onlineFemaleNum]
              userOnlineCountECO.series[2].data = [self.userCountData.onlineGenderOtherNum]
              self.userOnlineCountEChartsOptions = userOnlineCountECO
            }
          })
      },
      loadUserClientCountData () {
        let self = this
        this.$http.get('/statistic/user/client/count')
          .then(function (res) {
            let content = res.data.data.content
            if (content.length > 0) {
              let userClientCountData = content
              let userClientCountECO = EChartsOptionsClientBar()
              let clientNames = []
              let allNum = []
              let allOnlineNum = []
              let maleNum = []
              let onlineMaleNum = []
              let femaleNum = []
              let onlineFemaleNum = []
              let otherGenderNum = []
              let onlineOtherGenderNum = []
              for (let i = 0; i < userClientCountData.length; i++) {
                let item = userClientCountData[i]
                clientNames.push(item.clientName)
                allNum.push(item.allNum)
                allOnlineNum.push(item.onlienAllNum)
                maleNum.push(item.maleNum)
                onlineMaleNum.push(item.onlineMaleNum)
                femaleNum.push(item.femaleNum)
                onlineFemaleNum.push(item.onlineFemaleNum)
                otherGenderNum.push(item.genderOtherNum)
                onlineOtherGenderNum.push(item.onlineGenderOtherNum)
              }
              userClientCountECO.xAxis[0].data = clientNames
              userClientCountECO.series.push({
                name: '总数量',
                type: 'bar',
                data: allNum
              })
              userClientCountECO.series.push({
                name: '在线总数量',
                type: 'bar',
                data: allOnlineNum
              })
              userClientCountECO.series.push({
                name: '男数量',
                type: 'bar',
                data: maleNum
              })
              userClientCountECO.series.push({
                name: '在线男数量',
                type: 'bar',
                data: onlineMaleNum
              })
              userClientCountECO.series.push({
                name: '女数量',
                type: 'bar',
                data: femaleNum
              })
              userClientCountECO.series.push({
                name: '在线女数量',
                type: 'bar',
                data: onlineFemaleNum
              })
              userClientCountECO.series.push({
                name: '其它数量',
                type: 'bar',
                data: otherGenderNum
              })
              userClientCountECO.series.push({
                name: '在线其它数量',
                type: 'bar',
                data: onlineOtherGenderNum
              })
              self.userClientEChartsOptions = userClientCountECO
            }
          })
      },
      loadUserAreaCountData () {
        let self = this
        this.$http.get('/statistic/user/area/count')
          .then(function (res) {
            let content = res.data.data.content
            if (content.length > 0) {
              let userAreaCountData = content
              let data = []
              let onlineData = []
              for (let i = 0; i < userAreaCountData.length; i++) {
                let item = userAreaCountData[i]
                data.push({
                  name: item.areaName,
                  value: [parseFloat(item.longitude), parseFloat(item.latitude), item.allNum, item.maleNum, item.femaleNum, item.genderOtherNum]
                })
                onlineData.push({
                  name: item.areaName,
                  value: [parseFloat(item.longitude), parseFloat(item.latitude), item.onlineAllNum, item.onlineMaleNum, item.onlineFemaleNum, item.onlineGenderOtherNum]
                })
              }

              // 区域分布
              let userAreaCountECO = EChartsOptionsArea()
              userAreaCountECO.series[0].data = data
              self.userAreatEChartsOptions = userAreaCountECO
              console.log(userAreaCountECO)
              // 在线区域分布
              let userOnlineAreaCountECO = EChartsOptionsArea()
              userOnlineAreaCountECO.series[0].data = onlineData
              self.userOnlineAreatEChartsOptions = userOnlineAreaCountECO
            }
          })
      }
    },
    watch: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
