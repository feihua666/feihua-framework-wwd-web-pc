<template>
  <el-select style="width:100%;" value="" filterable :disabled="disabled" v-model="model" v-on:focus="handleFocus($event)" v-on:handleBlur="handleBlur($event)" v-on:change="emitChange" v-on:input="emitInput">
    <el-option label="不限" value="" v-if="showNone"></el-option>
    <el-option  v-for="item in options" :label="item.title" :value="item.id" :key="item.id"></el-option>
  </el-select>
</template>

<script>
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
        options: [],
        searchFormModel: {
          orderable: true,
          orderby: 'update_at-desc',
          pageable: false
        }
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
        this.$http.get('/wwd/activitys', self.searchFormModel)
          .then(function (response) {
            let content = response.data.data.content
            self.options = content
          })
          .catch(function (error) {
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
