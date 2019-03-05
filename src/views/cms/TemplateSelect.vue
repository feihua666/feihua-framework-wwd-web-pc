<template>
  <el-select value="" :placeholder="placeholder" :disabled="disabled" v-model="model" v-on:focus="handleFocus($event)" v-on:handleBlur="handleBlur($event)" v-on:change="emitChange" v-on:input="emitInput">
    <el-option label="使用默认设置" value="" v-if="showNone"></el-option>
    <el-option  v-for="item in options" :label="item" :value="item" :key="item"></el-option>
  </el-select>
</template>

<script>
  export default {
    name: 'TemplateSelect',
    props: {
      value: '',
      showNone: {
        default: true
      },
      // site channel content
      type: null,
      placeholder: null,
      siteId: null,
      folder: true,
      templatePath: null,
      disabled: {
        default: false
      }
    },
    data () {
      return {
        model: '',
        options: [],
        param: {
          siteId: null,
          templatePath: null
        }
      }
    },
    mounted () {
      this.loadTemplate()
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
      loadTemplate () {
        let self = this
        if (self.type) {
          let url = null
          if (self.type === 'site') {
            if (self.folder) {
              url = '/cms/site/templatepath'
            } else {
              if (!self.templatePath) {
                return
              }
              self.param.templatePath = self.templatePath
              url = '/cms/site/template'
            }
          } else if (self.type === 'channel') {
            url = '/cms/channel/template'
            self.param.siteId = self.siteId
          } else if (self.type === 'content') {
            url = '/cms/content/template'
            self.param.siteId = self.siteId
          }

          self.$http.get(url, self.param).then(function (res) {
            self.options = res.data.data.content
          }).catch(error => {
            if (error.response.status !== 404) {
              self.$message.error('模板加载失败:' + self.type)
            }
          })
        }
      }
    },
    watch: {
      value (val) {
        this.model = val
      },
      templatePath () {
        this.loadTemplate()
      },
      siteId () {
        this.loadTemplate()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
