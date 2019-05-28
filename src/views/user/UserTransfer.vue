<template>
  <el-transfer
    filterable
    :titles="['待选','已选']"
    filter-placeholder="请输入性名"
    v-model="valueData"
    :data="leftData"
    v-on:change="change"
    v-loading="dataloading"
  >
  </el-transfer>
</template>

<script>
  export default {
    name: 'UserTransfer',
    props: {
      value: {
        default: function () {
          return []
        }
      }
    },
    data () {
      return {
        dataloading: false,
        leftData: [],
        valueData: []
      }
    },
    mounted () {
      console.log('UserTransfer')
      this.valueData = this.value
      this.loadUserData()
    },
    methods: {
      loadUserData () {
        let self = this
        self.dataloading = true
        this.$http.get('/base/users')
          .then(function (response) {
            let content = response.data.data.content
            let tempLeftData = []
            for (let i = 0; i < content.length; i++) {
              tempLeftData.push({
                key: content[i].id,
                label: content[i].nickname
              })
            }
            self.leftData = tempLeftData
            self.dataloading = false
          }).catch(function () {
            self.dataloading = false
          })
      },
      change (a, b, c) {
        this.$emit('input', a)
        this.$emit('change', a, b, c)
      }
    },
    watch: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
