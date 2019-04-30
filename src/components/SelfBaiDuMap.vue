<template>
 <div :style="{height:height,width:width}">
 </div>
</template>

<script>
  export default {
    name: 'SelfBaiDuMap',
    props: {
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '300px'
      },
      initZoom: {
        default: 14
      },
      // 地图初始坐标
      // 类型为数组[116.404, 39.915]
      initPoint: {
        type: Array,
        default: function () {
          return [116.404, 39.915]
        }
      },
      initAuto: {
        default: true
      },
      ak: {
        default: null
      }
    },
    data () {
      return {
        map: null
      }
    },
    mounted () {
      console.log('SelfBaiDuMap mounted')
      let self = this
      this.bMapScript(this.ak).then(function (BMap) {
        if (self.initAuto === true) {
          self.init(BMap)
        } else {
          self.$emit('ready')
        }
      })
    },
    methods: {
      init (BMap) {
        if (this.map) {
          return
        }
        this.map = new BMap.Map(this.$el)
        let point = this.newPoint(this.initPoint[0], this.initPoint[1])
        this.map.centerAndZoom(point, this.initZoom)
        this.$emit('ready', this.map)
      },
      bMapScript (ak) {
        if (!ak) {
          ak = this.$config.bMapAk
        }
        // 感谢vue-baidu-map项目
        if (!window.BMap) {
          window.BMap = {}
          window.BMap._preloader = new Promise((resolve, reject) => {
            window._initBaiduMap = function () {
              resolve(window.BMap)
              window.document.body.removeChild($script)
              window.BMap._preloader = null
              window._initBaiduMap = null
            }
            const $script = document.createElement('script')
            window.document.body.appendChild($script)
            $script.src = `https://api.map.baidu.com/api?v=2.0&ak=${ak}&callback=_initBaiduMap`
          })
          return window.BMap._preloader
        } else if (!window.BMap._preloader) {
          return Promise.resolve(window.BMap)
        } else {
          return window.BMap._preloader
        }
      },
      newPoint (longitude, latitude) {
        let point = new window.BMap.Point(longitude, latitude)
        return point
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
