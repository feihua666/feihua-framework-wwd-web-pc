<template>

  <el-checkbox-group value="" :disabled="disabled" v-model="model" v-on:focus="handleFocus($event)" v-on:handleBlur="handleBlur($event)" v-on:change="emitChange" v-on:input="emitInput">
    <el-checkbox  v-for="item in options" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
  </el-checkbox-group>
</template>

<script>
  export default {
    name: 'LoginClientCheckboxGroup',
    props: {
      value: '',
      showCheckAll: {
        default: true
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
        let items = []
        if (val && val.length > 0) {
          for (let j = 0; j < this.options.length; j++) {
            for (let i = 0; i < val.length; i++) {
              if (this.options[j].id === val[i]) {
                items.push(this.options[j])
                break
              }
            }
          }
        }
        this.$emit('change', val, items)
      },
      emitInput (val) {
        this.$emit('input', val)
      },
      // 加载数据
      loadData () {
        let self = this
        self.$http.get('/base/client/loginclients', self.searchFormModel)
          .then(function (response) {
            self.options = response.data.data.content
          }).catch(error => {
            if (error.response.status === 404) {
              self.$message.error('客户端配置加载失败:' + self.type)
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
