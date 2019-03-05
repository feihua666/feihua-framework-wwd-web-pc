<template>

  <div class="wrapper">
    <el-container>
      <el-main>
        <self-table :columns="columns" :tableData="tableData" :table-loading="tableLoading">
        </self-table>
      </el-main>
    </el-container>

  </div>
</template>

<script>
  import SelfTable from '@/components/SelfTable.vue'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'

  export default {
    name: 'Account',
    components: {
      SelfDictSelect,
      SelfTable
    },
    data () {
      return {
        columns: [
          {
            name: 'type',
            label: '类型',
            dict: 'weixin_account_type'
          },
          {
            name: 'template_id',
            label: '模板ID'
          },
          {
            name: 'title',
            label: '模板标题'
          },
          {
            name: 'primary_industry',
            label: '一级行业'
          },
          {
            name: 'deputy_industry',
            label: '二级行业'
          },
          {
            name: 'content',
            label: '模板内容'
          },
          {
            name: 'example',
            label: '模板示例'
          }
        ],
        // 表格数据
        tableData: [],
        tableLoading: false,
        searchFormModel: {},
        dialogVisible: false,
        dialogValue: null
      }
    },
    mounted () {
      this.loadTableData()
    },
    methods: {
      searchBtnClick () {
        this.loadTableData()
      },
      resetFormClick () {
        this.$refs['searchForm'].resetFields()
      },
      // 加载表 格数据
      loadTableData (id) {
        let self = this
        self.tableLoading = true
        this.$http.get('/weixinaccount/wxalltemplates/' + id, self.searchFormModel)
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
    watch: {},
    // tab切换如果参数不一样，重新加载数据
    beforeRouteEnter (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        if (vm.id !== vm.$route.params.id) {
          vm.id = vm.$route.params.id
          vm.loadTableData(vm.id)
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .wrapper .el-collapse {
    padding: 0 10px;
  }

  .el-main {
    padding: 0;
  }

  .el-aside {
    border-right: 1px solid #e6ebf5;
  }

  .wrapper, .el-container {
    height: 100%;
  }
</style>
<style>
</style>
