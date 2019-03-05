<template>

  <el-checkbox-group value="" :disabled="disabled" v-model="model" v-on:focus="handleFocus($event)" v-on:handleBlur="handleBlur($event)" v-on:change="emitChange" v-on:input="emitInput">
    <el-checkbox  v-for="item in options" :label="item.which" :disabled="item.status !== 'Y'" :key="item.id">{{item.name}}</el-checkbox>
  </el-checkbox-group>
</template>

<script>
  export default {
    name: 'WeixinAccountCheckboxGroup',
    props: {
      value: '',
      showCheckAll: {
        default: true
      },
      // 标识是公众号还是小程序，默认公众号，false=公众号，true=小程序
      miniprogram: {
        default: false
      },
      disabled: {
        default: false
      },
      min: {
        default: null
      },
      max: {
        default: null
      }
    },
    data () {
      return {
        model: [],
        options: [],
        // 搜索的查询条件
        searchFormModel: {
          type: '',
          pageable: false,
          pageNo: 1,
          pageSize: 10
        }
      }
    },
    mounted () {
      this.loadData()
    },
    methods: {
      handleFocus (event) {
        this.$emit('focus', event)
      },
      handleBlur (event) {
        this.$emit('blur', event)
      },
      emitChange (val) {
        this.$emit('change', val)
      },
      emitInput (val) {
        this.$emit('input', val)
      },
      // 加载数据
      loadData () {
        let self = this
        let type = 'weixin_publicplatform'
        if (self.miniprogram === true) {
          type = 'weixin_miniprogram'
        }
        self.searchFormModel.type = type
        self.$http.get('/weixinaccount/accounts', self.searchFormModel)
          .then(function (response) {
            self.options = response.data.data.content
          }).catch(error => {
            if (error.response.status === 404) {
              self.$message.error('微信公众帐号加载失败:' + self.type)
            }
          })
      }
    },
    watch: {
      value (val) {
        this.model = val
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
