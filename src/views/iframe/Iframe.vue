<template>
  <div style="height: 100%;width: 100%;">
    <iframe style="border: 0;" height="100%" width="100%" v-for="srcUrl in srcUrls" :class="srcUrl === currentSrcUrl ? 'show': 'hide'" :src="srcUrl"></iframe>
  </div>

</template>

<script>
  export default {
    name: 'Iframe',
    data () {
      return {
        srcUrls: [],
        currentSrcUrl: null
      }
    },
    mounted () {
    },
    methods: {
    },
    watch: {
      currentSrcUrl (val) {
        /* eslint-disable no-unused-vars */
        let isExist = false
        for (let i = 0; i < this.srcUrls.length; i++) {
          if (val === this.srcUrls[i]) {
            isExist = true
          }
        }
        if (!isExist) {
          this.srcUrls.push(val)
        }
      },
      '$route' (to, from) {
        if (to.name === 'Iframe' && from.name === 'Iframe') {
          this.currentSrcUrl = this.$route.query.url
        }
      }
    },
    // tab切换如果参数不一样，重新加载数据
    beforeRouteEnter  (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        // if (vm.currentSrcUrl !== vm.$route.query.url) {
        vm.currentSrcUrl = vm.$route.query.url
        // }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
iframe.show{
  display: block;
}iframe.hide{
   display: none;
 }
</style>
