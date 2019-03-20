<template>

  <div class="wrapper">
    <el-container>
      <el-main>
        <el-collapse value="1">
          <el-collapse-item title="查询条件" name="1">
            <el-form ref="searchForm" :model="searchFormModel" :inline="true" size="small">
              <el-form-item label="关键字" prop="keyword">
                <el-input v-model="searchFormModel.keyword"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchBtnClick">查询</el-button>
                <el-button @click="resetFormClick">重置</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <self-table :columns="columns" :tableData="tableData" :page="page" :table-loading="tableLoading"
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
    name: 'WwdActivityOrder',
    components: {
      SelfDictSelect,
      SelfTable,
      SelfPage
    },
    data () {
      return {
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
            name: 'type',
            label: '订单类型'
          },
          {
            name: 'status',
            dict: 'yes_no',
            label: '订单状态'
          },
          {
            name: 'remarks',
            label: '订单备注'
          },
          {
            label: '操作',
            fixed: 'right',
            width: '200',
            buttons: [
              {
                label: '删除',
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
          keyword: '',
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
