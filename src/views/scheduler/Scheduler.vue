<template>

  <el-container  class="fh-page-wrapper">
        <el-main>
          <el-collapse value="1">
            <el-collapse-item title="查询条件" name="1">
              <el-form ref="searchForm" :model="searchFormModel" :inline="true" size="small">

                <el-form-item label="任务名称" prop="name">
                  <el-input  v-model="searchFormModel.name"></el-input>
                </el-form-item>
                <el-form-item label="任务名称英文" prop="jobName">
                  <el-input  v-model="searchFormModel.jobName"></el-input>
                </el-form-item>
                <el-form-item label="任务class" prop="jobClass">
                  <el-input  v-model="searchFormModel.jobClass"></el-input>
                </el-form-item>
                <el-form-item label="任务组" prop="jobGroup">
                  <el-input  v-model="searchFormModel.jobGroup"></el-input>
                </el-form-item>
                <el-form-item label="触发器名称英文" prop="triggerName">
                  <el-input  v-model="searchFormModel.triggerName"></el-input>
                </el-form-item>
                <el-form-item label="触发器组" prop="triggerGroup">
                  <el-input  v-model="searchFormModel.triggerGroup"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" @click="searchBtnClick">查询</el-button>
                  <el-button type="primary" icon="el-icon-plus" @click="addTableRowClick">添加</el-button>
                  <el-button type="primary" icon="el-icon-search" @click="viewSchedulerOrigin">查看脱管列表</el-button>
                </el-form-item>
              </el-form>
            </el-collapse-item>
          </el-collapse>
          <self-table :columns="columns" :tableData="tableData" :page="page" :table-loading="tableLoading" v-on:pageSizeChange="pageSizeChange" v-on:pageNoChange="pageNoChange">
          </self-table>
        </el-main>
      </el-container>

</template>

<script>
  import SelfPage from '@/components/SelfPage.vue'
  import SelfTable from '@/components/SelfTable.vue'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  export default {
    name: 'Scheduler',
    components: {
      SelfDictSelect,
      SelfTable,
      SelfPage
    },
    data () {
      return {
        columns: [
          {
            type: 'expand'
          },
          {
            name: 'schedulerDto.name',
            label: '任务名称'
          },
          {
            name: 'schedulerDto.triggerCronExpression',
            label: '触发器cron表达式',
            showInTable: false
          },
          {
            name: 'schedulerDto.triggerCronExpressionDesc',
            label: 'cron表达式描述'
          },
          {
            name: 'triggerDetailDto.startTime',
            label: '开始时间',
            showInTable: false
          },
          {
            name: 'triggerDetailDto.previousFireTime',
            label: '上次执行时间',
            showInTable: false
          },
          {
            name: 'triggerDetailDto.nextFireTime',
            label: '下次执行时间'
          },
          {
            name: 'triggerDetailDto.mayFireAgain',
            label: '是否再次执行',
            dict: 'yes_no',
            showInTable: false
          },
          {
            name: 'triggerDetailDto.misfireInstruction',
            label: '丢失执行数',
            showInTable: false
          },
          {
            name: 'schedulerDto.excuteNum',
            label: '执行次数',
            showInTable: false
          },
          {
            name: 'schedulerDto.excuteAvgTime',
            label: '上次耗时ms'
          },
          {
            name: 'schedulerStatus',
            label: '任务状态',
            dict: 'scheduler_status'
          },
          {
            name: 'description',
            label: '备注',
            showInTable: false
          },
          {
            label: '操作',
            width: '600',
            buttons: [
              {
                label: '编辑',
                styleType: 'primary',
                icon: 'el-icon-edit',
                click: this.editTableRowClick,
                disabled: this.editBtnDisabled
              },
              {
                label: '修改执行时间',
                styleType: 'primary',
                icon: 'el-icon-setting',
                click: this.editTriggerTime,
                disabled: this.editTriggerTimeBtnDisabled
              },
              {
                label: '发布',
                styleType: 'primary',
                icon: 'el-icon-setting',
                click: this.publish,
                disabled: this.publishBtnDisabled
              },
              {
                label: '取消发布',
                click: this.remove,
                styleType: 'primary',
                icon: 'el-icon-setting',
                disabled: this.removeBtnDisabled
              },
              {
                label: '暂停',
                click: this.pause,
                styleType: 'primary',
                icon: 'el-icon-setting',
                disabled: this.pauseBtnDisabled
              },
              {
                label: '恢复',
                click: this.resume,
                styleType: 'primary',
                icon: 'el-icon-setting',
                disabled: this.resumeBtnDisabled
              },
              {
                label: '查看执行记录',
                styleType: 'primary',
                icon: 'el-icon-search',
                click: this.viewExcuteRecord,
                disabled: this.viewExcuteRecordBtnDisabled
              },
              {
                label: '删除',
                styleType: 'danger',
                icon: 'el-icon-delete',
                click: this.deleteTableRowClick,
                disabled: this.deleteBtnDisabled
              }
            ]
          }
        ],
        page: {
          pageNo: 1,
          dataNum: 0
        },
        // 表格数据
        tableData: [],
        tableLoading: false,
        // 搜索的查询条件
        searchFormModel: {
          name: '',
          jobName: '',
          jobClass: '',
          jobGroup: '',
          triggerName: '',
          triggerGroup: '',
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
      loadTableData (pageNo, pageNoChange) {
        let self = this
        if (pageNo > 0) {
          if (pageNoChange) {
            self.searchFormModel.pageNo = pageNo
          } else {
            if (self.page.pageNo !== pageNo) {
              self.page.pageNo = pageNo
              return
            }
          }
        }
        self.tableLoading = true
        this.$http.get('/scheduler/schedulers', self.searchFormModel)
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
        this.page.pageNo = val
        this.loadTableData(val, true)
      },
      // tablb 表格编辑行
      editTableRowClick (index, row) {
        this.$utils.loadDataControl.add('SchedulerEditLoadData=true')
        this.$router.push('/Main/SchedulerEdit/' + row.schedulerDto.id)
      },
      editBtnDisabled (index, row) {
        return row.schedulerStatus !== 'offline'
      },
      // tablb 表格删除行
      deleteTableRowClick (index, row) {
        let self = this
        this.$confirm('确定要删除吗, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          this.$http.delete('/scheduler/scheduler/' + row.schedulerDto.id)
            .then(function (response) {
              self.$message.success('删除成功')
              // 重新加载数据
              self.searchBtnClick()
            })
            .catch(function (error) {
              if (error.response.status === 404) {
                self.$message.error('删除失败，请刷新数据再试')
              }
            })
        })
      },
      deleteBtnDisabled (index, row) {
        return row.schedulerStatus !== 'offline'
      },
      addTableRowClick () {
        this.$utils.loadDataControl.add('SchedulerAddLoadData=true')
        this.$router.push('/Main/SchedulerAdd')
      },
      viewSchedulerOrigin () {
        this.$router.push('/Main/SchedulerOrigin')
      },
      publish (index, row) {
        let self = this
        self.$http.post('/scheduler/scheduler/' + row.schedulerDto.id + '/publish')
          .then(function (res) {
            self.$message.success('发布成功')
            // 重新加载数据
            self.searchBtnClick()
          }).catch(function (res) {
            let statusCode = res.response.status
            let code = res.data.code
            if (statusCode === 400) {
              if (code === 'ClassNotFound') {
                self.$message.error('发布失败，未找到类')
              }
            } else if (statusCode === 404) {
              self.$message.error('发布失败，未找到待发布任务')
            }
          })
      },
      publishBtnDisabled (index, row) {
        return row.schedulerStatus !== 'offline'
      },
      // 取消发布
      remove (index, row) {
        let self = this
        self.$http.post('/scheduler/scheduler/' + row.schedulerDto.id + '/remove')
          .then(function (res) {
            self.$message.success('取消发布成功')
            // 重新加载数据
            self.searchBtnClick()
          }).catch(function (res) {
            let statusCode = res.response.status
            if (statusCode === 404) {
              self.$message.error('取消发布失败，未找到已发布任务')
            }
          })
      },
      removeBtnDisabled (index, row) {
        return row.schedulerStatus === 'offline'
      },
      // 暂停
      pause (index, row) {
        let self = this
        self.$http.post('/scheduler/scheduler/' + row.schedulerDto.id + '/pause')
          .then(function (res) {
            self.$message.success('暂停成功')
            // 重新加载数据
            self.searchBtnClick()
          }).catch(function (res) {
            let statusCode = res.response.status
            if (statusCode === 404) {
              self.$message.error('暂停失败，未找到已发布任务')
            }
          })
      },
      pauseBtnDisabled (index, row) {
        return row.schedulerStatus !== 'normal'
      },
      // 恢复暂停
      resume (index, row) {
        let self = this
        self.$http.post('/scheduler/scheduler/' + row.schedulerDto.id + '/resume')
          .then(function (res) {
            self.$message.success('恢复暂停成功')
            // 重新加载数据
            self.searchBtnClick()
          }).catch(function (res) {
            let statusCode = res.response.status
            if (statusCode === 404) {
              self.$message.error('恢复暂停失败，未找到已发布任务')
            }
          })
      },
      resumeBtnDisabled (index, row) {
        return row.schedulerStatus !== 'pause'
      },
      // 修改触发时间
      editTriggerTime (index, row) {
        this.$utils.loadDataControl.add('SchedulerEditTriggerTimeLoadData=true')
        this.$router.push('/Main/SchedulerEditTriggerTime/' + row.schedulerDto.id)
      },
      editTriggerTimeBtnDisabled (index, row) {
        return row.schedulerStatus !== 'normal'
      },
      viewExcuteRecord (index, row) {
        this.$router.push('/Main/SchedulerExcuteRecord/' + row.schedulerDto.id + '?schedulerName=' + row.schedulerDto.name)
      },
      viewExcuteRecordBtnDisabled (index, row) {
        return row.schedulerDto.excuteNum <= 0
      }
    },
    watch: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
