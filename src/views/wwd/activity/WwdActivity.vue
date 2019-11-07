<template>
  <el-container class="fh-page-wrapper">
      <el-main>
        <el-collapse value="1">
          <el-collapse-item title="查询条件" name="1">
            <el-form ref="searchForm" :model="searchFormModel" :inline="true" size="small">
              <el-form-item label="名称" prop="title">
                <el-input v-model="searchFormModel.title"></el-input>
              </el-form-item>
              <el-form-item label="活动状态" prop="status">
                <self-dict-select v-model="searchFormModel.status" type="activity_status"></self-dict-select>
              </el-form-item>
              <el-form-item label="人数规则" prop="headcountRule">
                <self-dict-select v-model="searchFormModel.headcountRule" type="wwd_headcount_rule"></self-dict-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="searchBtnClick">查询</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="addTableRowClick">添加</el-button>
                <el-button type="warning" icon="el-icon-refresh" @click="resetFormClick">重置</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <self-table @sortChange="sortChange" :default-sort="defaultSort"  :columns="columns" :tableData="tableData" :page="page" :table-loading="tableLoading"
                    v-on:pageSizeChange="pageSizeChange" v-on:pageNoChange="pageNoChange">
        </self-table>
      </el-main>
      <el-dialog
        :title="statusForm.title"
        :visible.sync="rowDialogVisible"
        width="375px"
        @before-close="rowDialogVisible = false">
        <el-form ref="statusForm" :model="statusForm">
          <el-form-item label="" prop="status" required>
            <el-radio-group v-model="statusForm.status">
              <el-radio-button label="editing">编辑中</el-radio-button>
              <el-radio-button label="signing">报名中</el-radio-button>
              <el-radio-button label="signfull">名额满</el-radio-button>
              <el-radio-button label="finished">已结束</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="editStatusSaveClick"  style="width: 100%" :loading="addLoading">保存</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-container>
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
            type: 'expand'
          },
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
            label: '作者',
            showInTable: false
          },
          {
            name: 'status',
            dict: 'activity_status',
            label: '状态'
          },
          {
            sortable: 'custom',
            sortBy: 'start_time',
            name: 'startTime',
            width: '150',
            label: '开始时间',
            showInTable: false
          },
          {
            sortable: 'custom',
            sortBy: 'end_time',
            name: 'endTime',
            width: '150',
            label: '结束时间',
            showInTable: false
          },
          {
            name: 'headcountRule',
            dict: 'wwd_headcount_rule',
            label: '人数规则',
            showInTable: false
          },
          {
            name: 'headcountMale',
            label: '男人数',
            showInTable: false
          },
          {
            name: 'headcountFemale',
            label: '女人数',
            showInTable: false
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
            name: 'requireIdCard',
            dict: 'yes_no',
            label: '是否需要身份证',
            showInTable: false
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
            width: '400',
            buttons: [
              {
                label: '编辑',
                styleType: 'primary',
                icon: 'el-icon-edit',
                click: this.editTableRowClick
              },
              {
                label: '复制',
                styleType: 'primary',
                icon: 'el-icon-edit',
                click: this.copyTableRowClick
              },
              {
                label: '发布状态',
                styleType: 'primary',
                icon: 'el-icon-edit',
                click: this.editStatusClick
              },
              {
                label: '查看活动人员',
                styleType: 'primary',
                icon: 'el-icon-search',
                click: this.participateRowClick
              },
              {
                label: '删除',
                styleType: 'danger',
                icon: 'el-icon-delete',
                click: this.deleteTableRowClick
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
          headcountRule: '',
          status: '',
          pageable: true,
          pageNo: 1,
          pageSize: 10
        },
        rowDialogVisible: false,
        addLoading: false,
        statusForm: {
          title: '',
          id: null,
          status: 'editing'
        }
      }
    },
    mounted () {
      // this.loadTableData(1)
    },
    methods: {
      sortChange (val) {
        this.searchFormModel.orderby = val.sortBy
        this.searchBtnClick()
      },
      headcountFormatter (index, row) {
        let html
        if (row.headcount === 0 || (row.headcountMale + row.headcountFemale) === 0) {
          html = (row.wwdParticipateDtos ? row.wwdParticipateDtos.length : 0) + ' / 不限'
        } else {
          html = (row.wwdParticipateDtos ? row.wwdParticipateDtos.length : 0) + ' / ' + (row.headcountRule === 'unlimited' ? row.headcount : (row.headcountMale + row.headcountFemale))
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
      editStatusClick (index, row) {
        let self = this
        let rowObj = row
        self.rowDialogVisible = true
        self.statusForm.title = rowObj.title
        self.statusForm.id = rowObj.id
        self.statusForm.status = rowObj.status
      },
      // 修改活动状态
      editStatusSaveClick () {
        let self = this
        if (self.addLoading === false) {
          this.$refs['statusForm'].validate((valid) => {
            if (valid) {
              // 请求添加
              self.addLoading = true
              self.$http.put('/wwd/activity/' + self.statusForm.id + '/edit/' + self.statusForm.status)
                .then(function (response) {
                  self.$message.info('修改成功')
                  self.addLoading = false
                  self.searchBtnClick()
                })
                .catch(function (response) {
                  if (response.response.status === 404) {
                    self.$message.error('修改失败，数据不存在或已被他人修改，请刷新列表后再试')
                  }
                  self.addLoading = false
                })
            } else {
              return false
            }
          })
        } else {
          self.$message.info('正在请求中，请耐心等待')
        }
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
</style>
