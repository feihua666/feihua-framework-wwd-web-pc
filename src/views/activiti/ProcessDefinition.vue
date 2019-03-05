<template>
  <div class="wrapper">
    <el-container>
      <el-main>
        <el-collapse value="1">
          <el-collapse-item title="查询条件" name="1">
            <el-form ref="searchForm" :model="searchFormModel" :inline="true" size="small">
              <el-form-item label="流程分类">
                <self-dict-select v-model="searchFormModel.category" type="activity_process_category"></self-dict-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchBtnClick">查询</el-button>
                <el-button type="primary" @click="deployBtnClick">部署</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <self-table :columns="columns" :tableData="tableData" :page="page" :table-loading="tableLoading" v-on:pageSizeChange="pageSizeChange" v-on:pageNoChange="pageNoChange"></self-table>
      </el-main>
    </el-container>

    <category-dialog :submit-click="setCategorySubmit" ref="categorydialog"></category-dialog>
    <deploy-dialog ref="deploydialog"></deploy-dialog>
  </div>
</template>

<script>
  import SelfTable from '@/components/SelfTable.vue'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import CategoryDialog from './CategoryDialog'
  import DeployDialog from './DeployDialog'
  export default {
    name: 'ProcessDefinition',
    components: {
      DeployDialog,
      CategoryDialog,
      SelfDictSelect,
      SelfTable
    },
    data () {
      return {
        columns: [
          {
            name: 'category',
            label: '流程分类',
            dict: 'activity_process_category'
          },
          {
            name: 'id',
            label: '流程ID'
          },
          {
            name: 'key',
            label: '流程标识'
          },
          {
            name: 'name',
            label: '流程名称'
          },
          {
            name: 'version',
            label: '流程版本'
          },
          {
            name: 'resourceName',
            label: '流程XML'
          },
          {
            name: 'diagramResourceName',
            label: '流程图片'
          },
          {
            name: 'deploymentTime',
            label: '部署时间'
          },
          {
            label: '操作',
            buttons: [
              {
                label: '设置分类',
                click: this.setCategaryClick
              },
              // 激活或挂起
              {
                label: this.activeOrSuspendLabelClick,
                click: this.activeOrSuspendClick
              },
              {
                label: '转换为模型',
                click: this.convertToModelClick
              },
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
          category: '',
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
        this.$http.get('/activity/processDefinitions', self.searchFormModel)
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
      // 部署
      deployBtnClick () {
        this.$refs.deploydialog.show()
      },
      // 设置分类
      setCategaryClick (index, row) {
        this.$refs.categorydialog.setCategory(row.category)
        this.$refs.categorydialog.setParam(row.id)
        this.$refs.categorydialog.show()
      },
      setCategorySubmit (category, id) {
        let self = this
        this.$http.put('/activity/processDefinition/' + id + '/category', {category: category})
          .then(response => {
            self.$message.success('更新成功')
            self.searchBtnClick()
            self.$refs.categorydialog.hide()
          })
      },
      // 签收或办理按钮标签
      activeOrSuspendLabelClick (index, row) {
        return (row.suspended && row.suspended === 'Y') ? '激活' : '挂起'
      },
      activeOrSuspendClick (index, row) {
        // 激活
        if (row.suspended && row.suspended === 'Y') {
          this.processDefinitionActive(index, row)
        } else {
          this.processDefinitionSuspend(index, row)
        }
      },
      // 激活
      processDefinitionActive (index, row) {
        let self = this
        this.$confirm('确定要激活吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$http.post('/activity/processDefinition/' + row.id + '/active')
            .then(response => {
              self.$message.success('激活成功')
              // 重新加载数据
              self.searchBtnClick()
            })
        })
      },
      // 挂起
      processDefinitionSuspend (index, row) {
        let self = this
        this.$confirm('确定要挂起吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$http.post('/activity/processDefinition/' + row.id + '/suspend')
            .then(function (response) {
              self.$message.success('挂起成功')
              // 重新加载数据
              self.searchBtnClick()
            })
        })
      },
      convertToModelClick (index, row) {
        let self = this
        this.$http.post('/activity/processDefinition/' + row.id + '/convertToModel')
          .then(response => {
            self.$message.success('转换成功')
            // 重新加载数据
            self.searchBtnClick()
          }).catch((error) => {
            if (error.response.status === 500) {
              self.$message.error('转换失败')
            }
          })
      },
      deleteTableRowClick (index, row) {
        let self = this
        this.$confirm('确定要删除吗, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          this.$http.delete('/activity/processDefinition/deployment/' + row.deploymentId)
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
