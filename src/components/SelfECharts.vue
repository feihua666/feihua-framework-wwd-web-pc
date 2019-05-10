<template>
    <div class="self-e-charts" :style="{height:height,width:width}">
      <SelfBaiDuMap v-if="loadMap" v-on:ready="mapReady"></SelfBaiDuMap>
    </div>
</template>

<script>
  import SelfBaiDuMap from '@/components/SelfBaiDuMap.vue'
  import echarts from 'echarts'
  import 'echarts/extension/bmap/bmap.js'
  export default {
    name: 'SelfECharts',
    components: {
      SelfBaiDuMap
    },
    props: {
      eChartsOptions: {
        type: Object,
        default: null
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '300px'
      },
      theme: {
        type: String,
        default: 'light'
      },
      loadMap: {
        default: false
      }
    },
    data () {
      return {
        chart: null
      }
    },
    mounted () {
      if (this.loadMap === false) {
        this.initChart()
      }
    },
    beforeDestroy () {
      this.dispose()
    },
    methods: {
      dispose () {
        if (!this.chart) {
          return
        }
        window.removeEventListener('resize', this.__resizeHandler)
        this.chart.dispose()
        this.chart = null
      },
      initChart () {
        this.dispose()
        this.chart = echarts.init(this.$el, this.theme)
        this.setOption(this.eChartsOptions)

        this.__resizeHandler = this.$utils.debounce(() => {
          if (this.chart) {
            this.chart.resize()
          }
        }, 100)
        window.addEventListener('resize', this.__resizeHandler)
      },
      setOption (option) {
        this.chart.setOption(option)
      },
      mapReady () {
        this.initChart()
        console.log('mapReady initChart')
        this.$emit('ready')
      },
      // 获取初始化后的实例
      // 如果使用地图，尽量在ready后调用以保证逻辑正确
      getChartIns () {
        return this.chart
      }
    },
    watch: {
      eChartsOptions: {
        deep: true,
        handler (newName, oldName) {
          this.setOption(newName)
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
