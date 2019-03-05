<template>
  <el-checkbox-group v-if="options && options.length > 0" value="" :disabled="disabled" v-model="model" v-on:focus="handleFocus($event)" v-on:handleBlur="handleBlur($event)" v-on:change="emitChange" v-on:input="emitInput">
    <el-checkbox  v-for="item in options" :label="item.id" :key="item.id" >{{item.name}}</el-checkbox>
  </el-checkbox-group>
  <div v-else>暂无内容分类</div>
</template>

<script>
  export default {
    name: 'ContentCategoryCheckboxGroup',
    props: {
      value: '',
      showCheckAll: {
        default: true
      },
      siteId: {
        default: null
      },
      parentId: null,
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
        options: [],
        // 搜索的查询条件
        searchFormModel: {
          siteId: null,
          parentId: null,
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

        if (!this.searchFormModel.siteId) {
          return
        }
        self.$http.get('/cms/content/categorys', self.searchFormModel)
          .then(function (response) {
            self.options = response.data.data.content
          })
      }
    },
    watch: {
      value (val) {
        this.model = val
      },
      siteId (val) {
        this.searchFormModel.siteId = val
        this.loadData()
      },
      parentId (val) {
        this.searchFormModel.parentId = val
        this.loadData()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
