<template>
  <el-container  class="fh-page-wrapper">
      <el-main>
        <el-collapse value="1">
          <el-collapse-item title="查询条件" name="1">
            <el-form ref="searchForm" :model="searchFormModel" :inline="true" size="small">
              <el-form-item label="编码" prop="code">
                <el-input  v-model="searchFormModel.clientCode"></el-input>
              </el-form-item>
              <el-form-item label="名称" prop="name">
                <el-input  v-model="searchFormModel.clientName"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" icon="el-icon-search" :loading="tableLoading" @click="searchBtnClick">查询</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="addTableRowClick">添加</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <self-table :columns="columns" :tableData="tableData" :page="page" :table-loading="tableLoading" v-on:pageSizeChange="pageSizeChange" v-on:pageNoChange="pageNoChange"></self-table>
      </el-main>
    </el-container>

</template>

<script>
    import SelfPage from '@/components/SelfPage.vue'
    import SelfTable from '@/components/SelfTable.vue'
    export default {
      name: 'LoginClient',
      components: {
        SelfTable,
        SelfPage
      },
      data () {
        return {
          columns: [
            {
              name: 'code',
              label: '编码'
            },
            {
              name: 'name',
              label: '名称'
            },
            {
              name: 'type',
              label: '类型',
              dict: 'login_client'
            },
            {
              label: '操作',
              buttons: [
                {
                  label: '编辑',
                  styleType: 'primary',
                  icon: 'el-icon-edit',
                  click: this.editTableRowClick
                },
                {
                  label: '绑定渠道',
                  styleType: 'primary',
                  icon: 'el-icon-setting',
                  click: this.bindTableRowClick,
                  disabled: this.bindTableRowClickBtn
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
            code: '',
            name: '',
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
          this.$http.get('/base/client/loginclients', self.searchFormModel)
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
          this.$utils.loadDataControl.add('LoginClientEditLoadData=true')
          this.$router.push('/Main/LoginClientEdit/' + row.id)
        },
        // tablb 表格删除行
        deleteTableRowClick (index, row) {
          let self = this
          this.$confirm('确定要删除吗, 是否继续?', '提示', {
            type: 'warning'
          }).then(() => {
            self.$http.delete('/base/client/loginclient/' + row.id)
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
        addTableRowClick () {
          this.$utils.loadDataControl.add('LoginClientAddLoadData=true')
          this.$router.push('/Main/LoginClientAdd')
        },
        bindTableRowClick (indwx, row) {
          this.$utils.loadDataControl.add('LoginClientChannelBindLoadData=true')
          this.$router.push('/Main/LoginClientChannelBind/' + row.id)
        },
        bindTableRowClickBtn (indwx, row) {
          return !(row.type === 'wx_publicplatform' || row.type === 'wx_miniprogram' || row.type === 'virtual_wx_publicplatform' || row.type === 'virtual_wx_miniprogram')
        }
      },
      watch: {
      }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
