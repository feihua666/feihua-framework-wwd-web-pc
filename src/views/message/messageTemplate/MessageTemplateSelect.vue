<template>
  <el-select value="" :disabled="disabled" v-model="model" v-on:focus="handleFocus($event)" v-on:handleBlur="handleBlur($event)" v-on:change="emitChange" v-on:input="emitInput">
    <el-option label="不限" value="" v-if="showNone"></el-option>
    <el-option  v-for="item in options" :label="item.name" :value="item.id" :key="item.id" ></el-option>
  </el-select>
</template>

<script>
  export default {
    name: 'MessageTemplateSelect',
    props: {
      value: '',
      showNone: {
        default: true
      },
      disabled: {
        default: false
      }
    },
    data () {
      return {
        model: '',
        options: [],
        // 搜索的查询条件
        searchFormModel: {
          pageable: false
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
        self.$http.get('/base/message/templates', self.searchFormModel)
          .then(function (response) {
            self.options = response.data.data.content
          }).catch(error => {
            if (error.response.status === 404) {
              self.$message.error('消息模板下拉加载失败')
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
