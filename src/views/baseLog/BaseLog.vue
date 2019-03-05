<template>

  <div class="wrapper">
    <el-container>
      <el-main>
        <el-collapse value="1">
          <el-collapse-item title="查询条件" name="1">
            <el-form ref="searchForm" :model="searchFormModel" :inline="true" size="small">
              <el-form-item label="关键字" prop="content">
                <el-input  v-model="searchFormModel.content"></el-input>
              </el-form-item>
              <el-form-item label="类型" prop="type">
                <self-dict-select v-model="searchFormModel.type" type="base_log_type"></self-dict-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchBtnClick">查询</el-button>
                <el-button @click="resetFormClick">重置</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <self-table :columns="columns" :tableData="tableData" :page="page" :table-loading="tableLoading" v-on:pageSizeChange="pageSizeChange" v-on:pageNoChange="pageNoChange"></self-table>
      </el-main>
    </el-container>
    <el-dialog
      title="提示"
      :visible.sync="rowDialogVisible"
      width="50%"
      @before-close="rowDialogVisible = false"  style="word-break: break-all;">
      <span v-html="rowParams"></span>
      <span slot="footer" class="dialog-footer">
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import SelfPage from '@/components/SelfPage.vue'
  import SelfTable from '@/components/SelfTable.vue'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  export default {
    name: 'BaseLog',
    components: {
      SelfDictSelect,
      SelfTable,
      SelfPage
    },
    data () {
      return {
        rowDialogVisible: false,
        rowParams: '',
        columns: [
          {
            name: 'nickname',
            label: '用户'
          },
          {
            name: 'type',
            dict: 'base_log_type',
            label: '类型'
          },
          {
            name: 'ip',
            label: 'IP'
          },

          {
            name: 'time',
            label: '执行时长(毫秒)'
          },
          {
            name: 'operation',
            label: '模块'
          },
          {
            name: 'content',
            label: '内容'
          },
          {
            name: 'method',
            label: '请求方法'
          },
          {
            name: 'updateAt',
            label: '创建时间'
          },
          {
            label: '操作',
            width: '200',
            buttons: [
              {
                label: '删除',
                click: this.deleteTableRowClick
              },
              {
                label: '查看请求参数',
                click: this.rowParamsInfo
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
          content: '',
          type: '',
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
        this.$http.get('/base/logs', self.searchFormModel)
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
      rowParamsInfo (index, row) {
        let self = this
        self.rowDialogVisible = true
        let b = {}
        b.p = row.params || ''
        // eslint-disable-next-line
        self.rowParams = b.p.replace(/\,/g, ',<br>').replace(/\)/g, ')<br/>')
      },
      // tablb 表格删除行
      deleteTableRowClick (index, row) {
        let self = this
        this.$confirm('确定要删除吗, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          this.$http.delete('/base/log/' + row.id)
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
