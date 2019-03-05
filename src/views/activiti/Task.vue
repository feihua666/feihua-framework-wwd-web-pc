<template>
  <div class="wrapper">
    <el-container>
      <el-main>
        <el-collapse value="1">
          <el-collapse-item title="查询条件" name="1">
            <el-form ref="searchForm" :model="searchFormModel" :inline="true" size="small">
              <el-form-item label="开始时间">
                <el-date-picker
                  v-model="searchFormModel.startTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间">
                <el-date-picker
                  v-model="searchFormModel.endTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="类型">
                <self-dict-select v-model="searchFormModel.activityType" type="activity_business_type"></self-dict-select>
              </el-form-item>
              <el-form-item label="任务状态">
                <self-dict-select v-model="searchFormModel.taskStatus" type="activity_task_status"></self-dict-select>
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
  import SelfPage from '@/components/SelfPage.vue'
  import SelfTable from '@/components/SelfTable.vue'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  export default {
    name: 'Task',
    components: {
      SelfDictSelect,
      SelfTable,
      SelfPage
    },
    data () {
      return {
        columns: [
          {
            name: 'processVariables.title',
            label: '标题'
          },
          {
            name: 'name',
            label: '当前环节'
          },
          {
            name: 'processDefinition.name',
            label: '流程名称'
          },
          {
            name: 'processDefinition.version',
            label: '流程版本'
          },
          {
            name: 'createTime',
            label: '创建时间'
          },
          {
            label: '操作',
            buttons: [
              {
                label: this.doOrClaimLabel,
                click: this.doOrClaimClick
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
          activityType: '',
          startTime: '',
          endTime: '',
          taskStatus: '',
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
        this.$http.get('/activity/tasks', self.searchFormModel)
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
      // 签收或办理按钮标签
      doOrClaimLabel (index, row) {
        return (row.assignee && row.assignee !== '') ? '办理' : '签收'
      },
      doOrClaimClick (index, row) {
        // 办理
        if (row.assignee && row.assignee !== '') {
          this.taskDo(index, row)
        } else {
          this.taskClaim(index, row)
        }
      },
      // 任务办理
      taskDo (index, row) {
        let form = {
          taskName: row.name,
          taskDefKey: row.taskDefinitionKey,
          procInsId: row.processInstanceId,
          procDefId: row.processDefinitionId,
          status: row.status,
          formUrl: '/Main/Oa/LeaveAduit'
        }
        let self = this
        this.$http.get('/activity/task/' + row.id + '/redirectbusinessform', form)
          .then(response => {
            let content = response.data.data.content
            self.$router.push(content.businessFormUri)
          })
      },
      // 任务签收
      taskClaim (index, row) {
        let self = this
        this.$confirm('签收后你将成为该任务的办理人，确认签收该任务吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$http.post('/activity/task/' + row.id + '/claim')
            .then(function (response) {
              self.$message.success('签收成功')
              // 重新加载数据
              self.searchBtnClick()
            })
        })
      },
      deleteTableRowClick (index, row) {
        let self = this
        this.$prompt('请输入删除原因', '提示', {
          inputErrorMessage: '请输入删除原因',
          inputValidator: function (value) {
            return !!value
          }
        }).then(({value}) => {
          this.$http.delete('/activity/task/' + row.id, {deleteReason: value})
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
