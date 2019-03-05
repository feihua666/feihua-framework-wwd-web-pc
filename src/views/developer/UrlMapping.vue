<template>

  <div class="wrapper">
    <el-container>
      <el-main>
        <el-collapse value="1">
          <el-collapse-item title="查询条件" name="1">
            <el-form ref="searchForm" :model="searchFormModel" label-width="100px"  size="small">
              <el-form-item label="url">
                <el-input  v-model="searchFormModel.url" placeholder="servletPath"></el-input>
              </el-form-item>
              <el-form-item label="请求方法">
                <self-dict-select v-model="searchFormModel.method" :showNone="false" type="httpRequest_method"></self-dict-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchBtnClick" :loading="tableLoading">解析</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <div v-for="item in tableData">{{item}}</div>
      </el-main>
    </el-container>

  </div>
</template>

<script>
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  export default {
    name: 'UrlMapping',
    components: {
      SelfDictSelect
    },
    data () {
      return {
        // 表格数据
        tableData: [],
        tableLoading: false,
        // 搜索的查询条件
        searchFormModel: {
          url: '',
          method: ''
        }
      }
    },
    mounted () {
    },
    methods: {
      // 查询按钮点击事件
      searchBtnClick () {
        this.loadTableData()
      },
      // 加载表格数据
      loadTableData () {
        let self = this
        self.tableLoading = true
        this.$http.get('/base/developer/urlmapping', self.searchFormModel)
          .then(function (response) {
            let content = response.data.data.content
            self.tableData = content
            self.tableLoading = false
          })
          .catch(function (error) {
            if (error.response.status === 404) {
              self.tableData = []
            }
            self.tableLoading = false
          })
      }
    },
    watch: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrapper{

}
.el-main{
  padding:0;
}
.el-aside{
  border-right: 1px solid #e6ebf5;
}
.wrapper,.el-container{
  height:100%;
}
</style>
<style>
.el-collapse-item__arrow {
  /* 由于用了rotate 这个东西不是个正方形所以改变角度的时候会出现滚动条 */
  margin-right: 20px;
}
</style>
