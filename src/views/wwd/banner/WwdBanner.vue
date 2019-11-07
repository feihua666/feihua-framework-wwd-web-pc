<template>

  <el-container  class="fh-page-wrapper">
      <el-main>
        <el-collapse value="1">
          <el-collapse-item title="查询条件" name="1">
            <el-form ref="searchForm" :model="searchFormModel" :inline="true" size="small">
              <el-form-item label="关键字" prop="title">
                <el-input v-model="searchFormModel.title"></el-input>
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <self-dict-select v-model="searchFormModel.status" type="yes_no"></self-dict-select>
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
    </el-container>

</template>

<script>
  import SelfPage from '@/components/SelfPage.vue'
  import SelfTable from '@/components/SelfTable.vue'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'

  export default {
    name: 'WwdBanner',
    components: {
      SelfDictSelect,
      SelfTable,
      SelfPage
    },
    data () {
      return {
        defaultSort: {prop: 'updateAt', order: 'descending'},
        addLoading: false,
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
            name: 'redirectUrl',
            label: '跳转链接',
            showInTable: false
          },
          {
            name: 'type',
            label: '类型'
          },
          {
            name: 'status',
            dict: 'yes_no',
            label: '状态'
          },
          {
            name: 'descp',
            label: '描述'
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
                label: '修改',
                styleType: 'primary',
                icon: 'el-icon-edit',
                click: this.editTableRowClick
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
          status: '',
          title: '',
          pageable: true,
          pageNo: 1,
          pageSize: 10
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
        this.$http.get('/wwd/banners', self.searchFormModel)
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
      addTableRowClick () {
        this.$utils.loadDataControl.add('WwdBannerAddLoadData=true')
        this.$router.push('/Main/Wwd/Banner/WwdBannerAdd')
      },
      // tablb 表格编辑行
      editTableRowClick (index, row) {
        this.$utils.loadDataControl.add('WwdBannerEditLoadData=true')
        this.$router.push('/Main/Wwd/Banner/WwdBannerEdit/' + row.id)
      },
      // tablb 表格删除行
      deleteTableRowClick (index, row) {
        let self = this
        this.$confirm('确定要删除吗, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          this.$http.delete('/wwd/banner/' + row.id)
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
