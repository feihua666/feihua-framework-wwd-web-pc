<template>

  <div class="wrapper">
    <el-container>
      <el-main>
        <el-collapse value="1">
          <el-collapse-item title="查询条件" name="1">
            <el-form ref="searchForm" :model="searchFormModel" :inline="true" size="small">
              <el-form-item label="模板名称">
                <el-input  v-model="searchFormModel.name"></el-input>
              </el-form-item>
              <el-form-item label="模板编码">
                <el-input  v-model="searchFormModel.code"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchBtnClick">查询</el-button>
                <el-button type="primary" @click="addTableRowClick">添加</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <self-table :columns="columns" :tableData="tableData" :page="page" :table-loading="tableLoading" v-on:pageSizeChange="pageSizeChange" v-on:pageNoChange="pageNoChange"></self-table>
      </el-main>
    </el-container>

  </div>
</template>

<script>
  import SelfPage from '@/components/SelfPage.vue'
  import SelfTable from '@/components/SelfTable.vue'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  export default {
    name: 'MessageTemplate',
    components: {
      SelfDictSelect,
      SelfTable,
      SelfPage
    },
    data () {
      return {
        columns: [
          {
            name: 'name',
            label: '模板名称'
          },
          {
            name: 'code',
            label: '模板编码'
          },
          {
            name: 'title',
            label: '消息标题'
          },
          {
            name: 'profile',
            label: '消息简介'
          },
          {
            name: 'content',
            label: '消息内容'
          },
          {
            name: 'msgType',
            label: '消息分类',
            dict: 'message_type'
          },
          {
            name: 'msgLevel',
            label: '消息紧急度',
            dict: 'message_level'
          },
          {
            label: '操作',
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
                label: '绑定三方模板',
                click: this.bindThirdTemplate
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
          name: '',
          code: '',
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
      loadTableData (pageNo) {
        let self = this
        if (pageNo) {
          self.searchFormModel.pageNo = pageNo
        }
        self.tableLoading = true
        this.$http.get('/base/message/templates', self.searchFormModel)
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
        this.loadTableData(val)
      },
      // tablb 表格编辑行
      editTableRowClick (index, row) {
        this.$router.push('/Main/MessageTemplateEdit/' + row.id)
      },
      // tablb 表格删除行
      deleteTableRowClick (index, row) {
        let self = this
        this.$confirm('确定要删除吗, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          self.$http.delete('/base/message/template/' + row.id)
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
        this.$utils.loadDataControl.add('MessageTemplateAddLoadData=true')
        this.$router.push('/Main/MessageTemplateAdd')
      },
      bindThirdTemplate (index, row) {
        this.$router.push('/Main/MessageTemplateThirdBind/' + row.id)
      }
    },
    watch: {
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
<style>
.el-collapse-item__arrow {
  /* 由于用了rotate 这个东西不是个正方形所以改变角度的时候会出现滚动条 */
  margin-right: 20px;
}
</style>
