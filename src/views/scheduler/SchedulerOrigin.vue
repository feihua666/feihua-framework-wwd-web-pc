<template>
  <el-container  class="fh-page-wrapper">
        <el-main>
          <el-collapse value="1">
            <el-collapse-item title="查询条件" name="1">
              <el-form ref="searchForm" :model="searchFormModel" :inline="true" size="small">
                <el-form-item label="任务名称英文" prop="jobName">
                  <el-input  v-model="searchFormModel.jobName"></el-input>
                </el-form-item>
                <el-form-item label="任务组" prop="jobGroup">
                  <el-input  v-model="searchFormModel.jobGroup"></el-input>
                </el-form-item>
                <el-form-item label="触发器名称" prop="triggerName">
                  <el-input  v-model="searchFormModel.triggerName"></el-input>
                </el-form-item>
                <el-form-item label="触发器组" prop="triggerGroup">
                  <el-input  v-model="searchFormModel.triggerGroup"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" :loading="tableLoading" @click="searchBtnClick">查询</el-button>
                </el-form-item>
              </el-form>
            </el-collapse-item>
          </el-collapse>
          <self-table :columns="columns" :tableData="tableData" :table-loading="tableLoading"></self-table>
        </el-main>
      </el-container>

</template>

<script>
  import SelfPage from '@/components/SelfPage.vue'
  import SelfTable from '@/components/SelfTable.vue'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  export default {
    name: 'SchedulerOrigin',
    components: {
      SelfDictSelect,
      SelfTable,
      SelfPage
    },
    data () {
      return {
        columns: [
          {
            name: 'schedulerName',
            label: '任务名称'
          },
          {
            name: 'jobName',
            label: '任务名称英文'
          },
          {
            name: 'jobClass',
            label: '任务class'
          },
          {
            name: 'jobGroup',
            label: '任务组'
          },
          {
            name: 'triggerName',
            label: '触发器名称'
          },
          {
            name: 'triggerGroup',
            label: '触发器组'
          },
          {
            name: 'triggerDetailDto.cronExpression',
            label: '触发器cron表达式'
          },
          {
            name: 'triggerDetailDto.startTime',
            label: '开始时间'
          },
          {
            name: 'triggerDetailDto.previousFireTime',
            label: '上次执行时间'
          },
          {
            name: 'triggerDetailDto.nextFireTime',
            label: '下次执行时间'
          },
          {
            name: 'triggerDetailDto.mayFireAgain',
            label: '是否再次执行',
            dict: 'yes_no'
          },
          {
            name: 'triggerDetailDto.misfireInstruction',
            label: '丢失执行数'
          },
          {
            name: 'schedulerStatus',
            label: '任务状态',
            dict: 'scheduler_status'
          },
          {
            label: '操作',
            buttons: [
              {
                label: '添加到任务计划管理中',
                click: this.addTableRowClick,
                styleType: 'primary',
                icon: 'el-icon-plus',
                disabled: this.addTableRowBtnDisabled
              }
            ]
          }
        ],
        // 表格数据
        tableData: [],
        tableLoading: false,
        // 搜索的查询条件
        searchFormModel: {
          jobName: '',
          jobGroup: '',
          triggerName: '',
          triggerGroup: ''
        }
      }
    },
    mounted () {
      this.loadTableData()
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
        this.$http.get('/scheduler/origin/schedulers', self.searchFormModel)
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
      },
      addTableRowBtnDisabled  (index, row) {
        return !!row.schedulerId
      },
      addTableRowClick (index, row) {
        let queryParam = '?'
        queryParam += 'jobName='
        queryParam += row.jobName
        queryParam += '&'
        queryParam += 'jobGroup='
        queryParam += row.jobGroup
        queryParam += '&'
        queryParam += 'jobClass='
        queryParam += row.jobClass
        queryParam += '&'
        queryParam += 'triggerName='
        queryParam += row.triggerName
        queryParam += '&'
        queryParam += 'triggerGroup='
        queryParam += row.triggerGroup
        queryParam += '&'
        queryParam += 'cron='
        queryParam += row.triggerDetailDto.cronExpression
        queryParam += '&'
        queryParam += 'description='
        queryParam += '从脱管中添加'
        this.$utils.loadDataControl.add('SchedulerAddLoadData=true')
        this.$router.push('/Main/SchedulerAdd' + queryParam)
      }
    },
    watch: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
