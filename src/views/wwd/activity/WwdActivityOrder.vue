<template>

  <el-container  class="fh-page-wrapper">
      <el-main>
        <el-collapse value="1">
          <el-collapse-item title="查询条件" name="1">
            <el-form ref="searchForm" :model="searchFormModel" :inline="true" size="small">
              <el-form-item label="关键字" prop="keyword">
                <el-input v-model="searchFormModel.keyword"></el-input>
              </el-form-item>
              <el-form-item label="支付方式" prop="payType">
                <self-dict-select v-model="searchFormModel.payType" type="wwd_pay_type"></self-dict-select>
              </el-form-item>
              <el-form-item label="订单状态" prop="payStatus">
                <self-dict-select v-model="searchFormModel.payStatus" type="wwd_pay_status"></self-dict-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="searchBtnClick">查询</el-button>
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
          <el-form-item label="" prop="payStatus" required>
            <self-dict-select v-model="statusForm.payStatus" type="wwd_pay_status"></self-dict-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-check" @click="editStatusSaveClick"  style="width: 100%" :loading="addLoading">保存</el-button>
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
    name: 'WwdActivityOrder',
    components: {
      SelfDictSelect,
      SelfTable,
      SelfPage
    },
    data () {
      return {
        defaultSort: {prop: 'updateAt', order: 'descending'},
        addLoading: false,
        rowDialogVisible: false,
        statusForm: {
          title: '',
          id: null,
          payStatus: 'no_pay'
        },
        columns: [

          {
            name: 'activityUrl',
            width: '100',
            image: true,
            label: '标题图'
          },
          {
            name: 'activityTitle',
            label: '标题'
          },
          {
            name: 'orderNo',
            label: '订单编号'
          },
          {
            name: 'baseUserDto.photo',
            width: '100',
            image: true,
            label: '用户头像'
          },
          {
            name: 'baseUserDto.nickname',
            label: '用户名'
          },
          {
            name: 'baseUserDto.gender',
            dict: 'gender',
            label: '性别'
          },
          {
            name: 'payType',
            dict: 'wwd_pay_type',
            label: '支付方式'
          },
          {
            name: 'payStatus',
            dict: 'wwd_pay_status',
            label: '订单状态'
          },
          {
            name: 'price',
            label: '订单价格'
          },
          {
            name: 'remarks',
            label: '订单备注'
          },
          {
            sortable: 'custom',
            sortBy: 'create_at',
            name: 'createAt',
            label: '创建时间'
          },
          {
            sortable: 'custom',
            sortBy: 'update_at',
            name: 'updateAt',
            label: '更新时间'
          },
          {
            label: '操作',
            fixed: 'right',
            width: '200',
            buttons: [
              {
                label: '修改支付状态',
                styleType: 'primary',
                icon: 'el-icon-edit',
                click: this.editStatusClick
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
          keyword: '',
          payType: '',
          payStatus: '',
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
        this.$http.get('/wwd/activity/orders', self.searchFormModel)
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
        //
      },
      editStatusClick (index, row) {
        let self = this
        let rowObj = row
        self.rowDialogVisible = true
        self.statusForm.title = ['[', rowObj.baseUserDto.nickname, ']', rowObj.activityTitle].join('')
        self.statusForm.id = rowObj.id
        self.statusForm.payStatus = rowObj.payStatus
      },
      // 修改活动状态
      editStatusSaveClick () {
        let self = this
        if (self.addLoading === false) {
          this.$refs['statusForm'].validate((valid) => {
            if (valid) {
              // 请求添加
              self.addLoading = true
              self.$http.put('/wwd/activity/order/' + self.statusForm.id + '/edit/' + self.statusForm.payStatus)
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
          this.$http.delete('/wwd/activity/order/' + row.id)
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
      }
    },
    watch: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
