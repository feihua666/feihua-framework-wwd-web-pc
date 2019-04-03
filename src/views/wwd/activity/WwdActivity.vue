<template>

  <div class="wrapper">
    <el-container>
      <el-main>
        <el-collapse value="1">
          <el-collapse-item title="查询条件" name="1">
            <el-form ref="searchForm" :model="searchFormModel" :inline="true" size="small">
              <el-form-item label="名称" prop="title">
                <el-input v-model="searchFormModel.title"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchBtnClick">查询</el-button>
                <el-button type="primary" @click="addTableRowClick">添加</el-button>
                <el-button @click="resetFormClick">重置</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <self-table @sortChange="sortChange" :default-sort="defaultSort"  :columns="columns" :tableData="tableData" :page="page" :table-loading="tableLoading"
                    v-on:pageSizeChange="pageSizeChange" v-on:pageNoChange="pageNoChange">
        </self-table>
      </el-main>
    </el-container>

  </div>
</template>

<script>
  import SelfPage from '@/components/SelfPage.vue'
  import SelfTable from '@/components/SelfTable.vue'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'

  export default {
    name: 'WwdActivity',
    components: {
      SelfDictSelect,
      SelfTable,
      SelfPage
    },
    data () {
      return {
        defaultSort: {prop: 'updateAt', order: 'descending'},
        columns: [
          {
            name: 'titleUrl',
            width: '100',
            image: true,
            label: '标题图'
          },
          {
            name: 'title',
            label: '标题'
          },
          {
            name: 'author',
            label: '作者'
          },
          {
            name: 'status',
            dict: 'activity_status',
            label: '状态'
          },
          {
            name: 'requireIdCard',
            dict: 'yes_no',
            label: '是否需要身份证'
          },
          {
            name: 'headcountRule',
            dict: 'wwd_headcount_rule',
            label: '人数规则'
          },
          {
            name: 'headcountMale',
            label: '男人数'
          },
          {
            name: 'headcountFemale',
            label: '女人数'
          },
          {
            name: 'headcount',
            html: this.headcountFormatter,
            label: '' +
              '已支付/总人数'
          },
          {
            name: 'malePrice',
            label: '人均男（元）'
          },
          {
            name: 'femalePrice',
            label: '人均女（元）'
          },
          {
            name: 'addr',
            label: '地址'
          },
          {
            sortable: 'custom',
            sortBy: 'update_at',
            name: 'updateAt',
            width: '150',
            label: '更新时间'
          },
          {
            label: '操作',
            fixed: 'right',
            width: '200',
            buttons: [
              {
                label: '编辑',
                click: this.editTableRowClick
              },
              {
                label: '删除',
                click: this.deleteTableRowClick
              },
              {
                label: '复制',
                click: this.copyTableRowClick
              },
              {
                label: '查看活动人员',
                click: this.participateRowClick
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
          orderable: true,
          orderby: 'update_at-desc',
          title: '',
          type: '',
          status: '',
          pageable: true,
          pageNo: 1,
          pageSize: 10
        },
        dialogVisible: false,
        synToWeixinLoading: false,
        dialogValue: null
      }
    },
    mounted () {
      this.loadTableData(1)
    },
    methods: {
      sortChange (val) {
        this.searchFormModel.orderby = val.sortBy
        this.searchBtnClick()
      },
      headcountFormatter (index, row) {
        let html
        if (row.headcount === 0) {
          html = (row.wwdParticipateDtos ? row.wwdParticipateDtos.length : 0) + ' / 不限'
        } else {
          html = (row.wwdParticipateDtos ? row.wwdParticipateDtos.length : 0) + ' / ' + row.headcount
        }
        return html
      },
      searchBtnClick () {
        this.loadTableData(1)
      },
      resetFormClick () {
        this.$refs['searchForm'].resetFields()
      },
      // 加载表 格数据
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
        this.$http.get('/wwd/activitys', self.searchFormModel)
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
        this.$router.push('/Main/Wwd/Activity/WwdActivityEdit/' + row.id)
      },
      // tablb 表格删除行
      deleteTableRowClick (index, row) {
        let self = this
        this.$confirm('确定要删除吗, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          this.$http.delete('/wwd/activity/' + row.id)
            .then(function (response) {
              self.$message.success('删除成功')
              // 重新加载数据
              self.searchBtnClick()
            })
            .catch(function (error) {
              if (error.response.status === 404) {
                self.$message.success('删除失败，请刷新数据再试')
              }
            })
        })
      },
      // tablb 表格复制行
      copyTableRowClick (index, row) {
        let self = this
        this.$confirm('确定要复制该活动吗，如复制需要重新编辑复制的活动, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          this.$http.get('/wwd/activity/copy/' + row.id)
            .then(function (response) {
              self.$message.success('复制成功，记得去重新编辑哦')
              // 重新加载数据
              self.searchBtnClick()
            })
            .catch(function (error) {
              if (error.response.status === 404) {
                self.$message.success('复制失败，请刷新数据再试')
              }
            })
        })
      },
      participateRowClick (index, row) {
        this.$router.push('/Main/Wwd/Activity/WwdParticipate/' + row.id)
      },
      addTableRowClick () {
        this.$utils.loadDataControl.add('WwdActivityAddLoadData=true')
        this.$router.push('/Main/Wwd/Activity/WwdActivityAdd')
      }
    },
    watch: {}
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
  .el-collapse-item__arrow {
    /* 由于用了rotate 这个东西不是个正方形所以改变角度的时候会出现滚动条 */
    margin-right: 20px;
  }
</style>
