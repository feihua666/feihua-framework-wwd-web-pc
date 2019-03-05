<template>
  <el-select style="width:100%;" value="" :disabled="disabled" v-model="model" v-on:focus="handleFocus($event)" v-on:handleBlur="handleBlur($event)" v-on:change="emitChange" v-on:input="emitInput">
    <el-option label="不限" value="" v-if="showNone"></el-option>
    <el-option  v-for="item in options" :label="item.name" :disabled="item.disabled" :value="item.value" :key="item.value" v-if="item.level > 1"></el-option>
  </el-select>
</template>

<script>
  import { getDictsByType } from '@/utils/dictUtils.js'
  export default {
    name: 'SelfDictSelect',
    props: {
      value: '',
      showNone: {
        default: true
      },
      type: {
        default: null
      },
      disabled: {
        default: false
      }
    },
    data () {
      return {
        model: '',
        options: []
      }
    },
    mounted () {
      this.model = this.value
      this.loadDict()
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
      // 加载字典
      loadDict () {
        let self = this
        if (self.type === undefined || self.type === '' || self.type === null) {
          return
        }
        getDictsByType(this, self.type).then(function (value) {
          self.options = value
        }).catch(error => {
          if (error.response.status === 404) {
            self.$message.error('字典下拉选项加载失败:' + self.type)
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
