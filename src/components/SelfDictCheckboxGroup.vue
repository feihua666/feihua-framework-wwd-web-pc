<template>
  <el-checkbox-group value="" :disabled="disabled" v-model="model" v-on:focus="handleFocus($event)" v-on:handleBlur="handleBlur($event)" v-on:change="emitChange" v-on:input="emitInput">
    <el-checkbox  v-for="item in options" :label="item.value" :disabled="item.disabled" :key="item.value" v-if="item.level > 1">{{item.name}}</el-checkbox>
  </el-checkbox-group>
</template>

<script>
  import { getDictsByType } from '@/utils/dictUtils.js'
  export default {
    name: 'SelfDictCheckboxGroup',
    props: {
      value: '',
      // string array 两种可选
      valueType: {
        default: 'array'
      },
      showCheckAll: {
        default: true
      },
      type: {
        default: null
      },
      disabled: {
        default: false
      },
      // 最少选几个
      min: {
        default: null
      },
      // 最多选几个
      max: {
        default: null
      }
    },
    data () {
      return {
        model: [],
        options: []
      }
    },
    mounted () {
      this.adapter()
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
        if (this.valueType === 'string') {
          if (val && val.length > 0) {
            this.$emit('change', val.join(','))
          } else {
            this.$emit('change', null)
          }
        } else {
          this.$emit('change', val)
        }
      },
      emitInput (val) {
        if (this.valueType === 'string') {
          if (val && val.length > 0) {
            this.$emit('input', val.join(','))
          } else {
            this.$emit('input', null)
          }
        } else {
          this.$emit('input', val)
        }
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
      },
      adapter () {
        if (this.valueType === 'string') {
          if (this.value) {
            let _array = this.value.split(',')
            this.model = []
            for (let i = 0; i < _array.length; i++) {
              this.model.push(_array[i])
            }
          } else {
            this.model = []
          }
        } else {
          if (this.value) {
            this.model = this.value
          }
        }
      }
    },
    watch: {
      value (val) {
        console.log(val)
        this.adapter()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
