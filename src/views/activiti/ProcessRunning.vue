<template>
  <div class="wrapper">
    <el-container>
      <el-main>
        <el-collapse value="1">
          <el-collapse-item title="查询条件" name="1">
            <el-form ref="searchForm" :model="searchFormModel" :inline="true" size="small">
              <el-form-item label="流程实例ID">
                <el-input v-model="searchFormModel.procInsId"></el-input>
              </el-form-item>
              <el-form-item label="流程定义Key">
                <el-input v-model="searchFormModel.procDefKey"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchBtnClick">查询</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <self-table :columns="columns" :tableData="tableData" :page="page" :table-loading="tableLoading" v-on:pageSizeChange="pageSizeChange" v-on:pageNoChange="pageNoChange"></self-table>
      </el-main>
    </el-container>

  </div>
</template>

<script>
  import SelfTable from '@/components/SelfTable.vue'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  export default {
    name: 'ProcessRunning',
    components: {
      SelfDictSelect,
      SelfTable
    },
    data () {
      return {
        columns: [
          {
            name: 'id',
            label: '执行ID'
          },
          {
            name: 'processInstanceId',
            label: '流程实例ID'
          },
          {
            name: 'processDefinitionId',
            label: '流程定义ID'
          },
          {
            name: 'activityId',
            label: '当前环节'
          },
          {
            name: 'suspended',
            label: '是否挂起',
            dict: 'yes_no'
          },
          {
            label: '操作',
            buttons: [
              {
                label: '删除',
                click: this.deleteTableRowClick
              }
            ]
          }
        ],
        page: {
          dataNum: 0
        },
        // 表格数据
        tableData: [],
        tableLoading: false,
        // 搜索的查询条件
        searchFormModel: {
          procInsId: '',
          procDefKey: '',
          pageable: true,
          pageNo: 1,
          pageSize: 10
        }
      }
    },
    mounted () {
      this.loadTableData(1)
    },
    methods: {
      // 查询按钮点击事件
      searchBtnClick () {
        this.loadTableData(1)
      },
      // 加载表格数据
      loadTableData (pageNo) {
        let self = this
        if (pageNo) {
          self.searchFormModel.pageNo = pageNo
        }
        self.tableLoading = true
        this.$http.get('/activity/processInstances', self.searchFormModel)
          .then(function (response) {
            let content = response.data.data.content
            self.tableData = content
            self.page.dataNum = response.data.data.page.dataNum
            self.tableLoading = false
          })
          .catch(function (error) {
            if (error.response.status === 404) {
              self.tableData = []
              self.page.dataNum = 0
            }
            self.tableLoading = false
          })
      },
      // 页面大小改变重新查询数据
      pageSizeChange (val) {
        this.searchFormModel.pageSize = val
        this.searchBtnClick()
      },
      // 页码改变加载对应页码数据
      pageNoChange (val) {
        this.loadTableData(val)
      },
      deleteTableRowClick (index, row) {
        let self = this
        this.$prompt('请输入删除原因', '提示', {
          inputErrorMessage: '请输入删除原因',
          inputValidator: function (value) {
            return !!value
          }
        }).then(({value}) => {
          this.$http.delete('/activity/processInstance/' + row.processInstanceId, {deleteReason: value})
            .then(function (response) {
              self.$message.success('删除成功')
              // 重新加载数据
              self.searchBtnClick()
            })
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .wrapper .el-collapse{
    padding: 0 10px;
  }
  .el-main{
    padding:0;
  }
</style>
