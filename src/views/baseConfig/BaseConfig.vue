<template>
  <el-container  class="fh-page-wrapper">
      <el-main>
        <el-collapse value="1">
          <el-collapse-item title="查询条件" name="1">
            <el-form ref="searchForm" :model="searchFormModel" :inline="true" size="small">
              <el-form-item label="关键字" prop="keyword">
                <el-input  v-model="searchFormModel.keyword"></el-input>
              </el-form-item>
              <el-form-item label="启用状态" prop="status">
                <self-dict-select v-model="searchFormModel.status" type="yes_no"></self-dict-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" :loading="tableLoading" @click="searchBtnClick">查询</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="addConfig">添加配置</el-button>
                <el-button type="warning" icon="el-icon-refresh" @click="resetFormClick">重置</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <self-table  @sortChange="sortChange" :default-sort="defaultSort" :columns="columns" :tableData="tableData" :page="page" :table-loading="tableLoading" v-on:pageSizeChange="pageSizeChange" v-on:pageNoChange="pageNoChange"></self-table>
      </el-main>
    </el-container>
</template>

<script>
  import SelfPage from '@/components/SelfPage.vue'
  import SelfTable from '@/components/SelfTable.vue'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  export default {
    name: 'BaseConfig',
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
            name: 'status',
            width: '100',
            dict: 'yes_no',
            label: '启用状态'
          },
          {
            name: 'configKey',
            label: 'KEY'
          },
          {
            name: 'description',
            label: '配置说明'
          },
          {
            sortable: 'custom',
            sortBy: 'update_at',
            name: 'updateAt',
            label: '创建时间'
          },
          {
            label: '操作',
            width: '300',
            buttons: [
              {
                label: '编辑',
                styleType: 'primary',
                icon: 'el-icon-edit',
                click: this.editConfigClick
              },
              {
                label: '可视化编辑',
                styleType: 'primary',
                icon: 'el-icon-edit',
                click: this.updateConfigClick
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
          dataNum: 0
        },
        // 表格数据
        tableData: [],
        tableLoading: false,
        // 搜索的查询条件
        searchFormModel: {
          status: '',
          keyword: '',
          orderable: true,
          orderby: 'update_at-desc',
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
      sortChange (val) {
        this.searchFormModel.orderby = val.sortBy
        this.searchBtnClick()
      },
      // 查询按钮点击事件
      searchBtnClick () {
        this.loadTableData(1)
      },
      resetFormClick () {
        this.$refs['searchForm'].resetFields()
      },
      // 加载表格数据
      loadTableData (pageNo) {
        let self = this
        if (pageNo) {
          self.searchFormModel.pageNo = pageNo
        }
        self.tableLoading = true
        this.$http.get('/base/configs', self.searchFormModel)
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
              self.tableOffice = {}
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
      addConfig () {
        this.$utils.loadDataControl.add('BaseConfigAddAddLoadData=true')
        this.$router.push('/Main/BaseConfig/BaseConfigAdd')
      },
      editConfigClick (index, row) {
        this.$utils.loadDataControl.add('BaseConfigEditAddLoadData=true')
        this.$router.push('/Main/BaseConfig/BaseConfigEdit/' + row.id)
      },
      updateConfigClick (index, row) {
        var self = this
        if (row.configKey === 'OSS_CLOUD_STORAGE_CONFIG_KEY') {
          self.$router.push('/Main/BaseConfig/OssConfig/' + row.id)
        } else {
          this.$confirm('没有可配置项', '提示', {
            type: 'warning'
          }).then(() => {
          })
        }
      },
      // tablb 表格删除行
      deleteTableRowClick (index, row) {
        let self = this
        this.$confirm('确定要删除吗, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          self.$http.delete('/base/config/' + row.id)
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
      }
    },
    watch: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
