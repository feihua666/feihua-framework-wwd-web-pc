<template>

  <div class="wrapper">
    <el-container>
      <el-main>
        <el-collapse value="1">
          <el-collapse-item title="查询条件" name="1">
            <el-form ref="searchForm" :model="searchFormModel" :inline="true" size="small">
              <el-form-item label="开始执行时间范围" prop="startExcuteTime">
                <el-date-picker
                  v-model="excuteStartTimeRange" value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="耗时范围" prop="minDuration">
                <el-col :span="11">
                  <el-input v-model="searchFormModel.minDuration" placeholder="请输入数字"></el-input>
                </el-col>
                <el-col  style="text-align: center" :span="2">-</el-col>
                <el-col :span="11">
                  <el-input v-model="searchFormModel.maxDuration" placeholder="请输入数字"></el-input>
                </el-col>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="searchBtnClick">查询</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <self-table :columns="columns" :tableData="tableData" :page="page" :table-loading="tableLoading"
                    v-on:pageSizeChange="pageSizeChange" v-on:pageNoChange="pageNoChange"></self-table>
      </el-main>
    </el-container>

  </div>
</template>

<script>
  import SelfPage from '@/components/SelfPage.vue'
  import SelfTable from '@/components/SelfTable.vue'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'

  export default {
    name: 'SchedulerExcuteRecord',
    components: {
      SelfDictSelect,
      SelfTable,
      SelfPage
    },
    data () {
      return {
        schedulerId: '',
        schedulerName: '',
        columns: [
          {
            name: 'schedulerName',
            label: '任务名称',
            formatter: this.schedulerNameFormatter
          },
          {
            name: 'startTime',
            label: '开始时间'
          },
          {
            name: 'endTime',
            label: '结束时间'
          },
          {
            name: 'duration',
            label: '耗时ms'
          }
        ],
        page: {
          pageNo: 1,
          dataNum: 0
        },
        // 表格数据
        tableData: [],
        tableLoading: false,
        excuteStartTimeRange: [],
        // 搜索的查询条件
        searchFormModel: {
          startExcuteTime: '',
          endExcuteTime: '',
          minDuration: '',
          maxDuration: '',
          orderby: 'start_time-desc',
          orderable: true,
          pageable: true,
          pageNo: 1,
          pageSize: 10
        }
      }
    },
    mounted () {
      this.initParams()
      this.loadTableData(1)
    },
    methods: {
      initParams () {
        this.schedulerId = this.$route.params.id
        this.schedulerName = this.$route.query.schedulerName
      },
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
        if (self.excuteStartTimeRange.length > 0) {
          self.searchFormModel.startExcuteTime = self.excuteStartTimeRange[0]
          self.searchFormModel.endExcuteTime = self.excuteStartTimeRange[1]
        }
        this.$http.get('/scheduler/scheduler/' + this.schedulerId + '/excuteRecords', self.searchFormModel)
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
            } else if (error.response.status === 400) {
              self.tableData = []
              self.page.dataNum = 0
              self.$message.error('参数不正确')
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
      schedulerNameFormatter (row) {
        return this.schedulerName
      }
    },
    watch: {},
    // tab切换如果参数不一样，重新加载数据
    beforeRouteEnter (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        if (vm.schedulerId !== vm.$route.params.id) {
          vm.schedulerId = vm.$route.params.id
          vm.schedulerName = vm.$route.query.schedulerName
          vm.searchBtnClick()
        }
      })
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
    .el-aside{
        border-right: 1px solid #e6ebf5;
    }
    .wrapper,.el-container{
        height:100%;
    }
</style>
