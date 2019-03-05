<template>

  <div class="wrapper">
    <el-container>
      <el-main>
        <el-collapse value="1">
          <el-collapse-item title="查询条件" name="1">
            <el-form ref="searchForm" :model="searchFormModel" :inline="true" size="small">
              <el-form-item label="名称">
                <el-input  v-model="searchFormModel.name"></el-input>
              </el-form-item>
              <el-form-item label="类型">
                <self-dict-select v-model="searchFormModel.type" type="file_type"></self-dict-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchBtnClick">查询</el-button>
                <el-button type="primary" @click="addTableRowClick">上传</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <self-table :columns="columns" :tableData="tableData" :page="page" :table-loading="tableLoading" v-on:pageSizeChange="pageSizeChange" v-on:pageNoChange="pageNoChange"></self-table>
      </el-main>
    </el-container>

    <file-upload ref="fileupload" :onSuccess="fileUploadSucess"></file-upload>
    <file-download-dialog ref="filedownload"></file-download-dialog>
  </div>
</template>

<script>
  import SelfTable from '@/components/SelfTable.vue'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import FileUpload from '@/components/FileUpload'
  import FileDownloadDialog from '@/components/FileDownloadDialog'
  export default {
    name: 'File',
    components: {
      FileDownloadDialog,
      FileUpload,
      SelfDictSelect,
      SelfTable},
    data () {
      return {
        columns: [
          {
            name: 'name',
            label: '名称'
          },
          {
            name: 'filename',
            label: '文件原名称'
          },
          {
            name: 'type',
            label: '分类',
            dict: 'file_type'
          },
          {
            name: 'downloadNum',
            label: '下载数'
          },
          {
            name: 'duration',
            label: '耗时(s)'
          },
          {
            name: 'filePath',
            label: '路径'
          },
          {
            name: 'createAt',
            label: '创建时间'
          },
          {
            label: '操作',
            buttons: [
              {
                label: '修改名称',
                click: this.updateName
              },
              {
                label: '下载',
                click: this.downloadFile
              },
              {
                label: '删除',
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
          name: '',
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
      // 加载表格数据
      loadTableData (pageNo) {
        let self = this
        if (pageNo) {
          self.searchFormModel.pageNo = pageNo
        }
        self.tableLoading = true
        this.$http.get('/base/files', self.searchFormModel)
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
      // 修改名称
      updateName (index, row) {
        let self = this
        this.$prompt('请输入名称', '提示', {
          inputErrorMessage: '请输入名称',
          inputValidator: function (value) {
            return !!value
          }
        }).then(({value}) => {
          this.$http.put('/base/file/' + row.id, {name: value})
            .then(function (response) {
              self.$message.success('更新成功')
              // 重新加载数据
              self.searchBtnClick()
            }).catch()
        })
      },
      // 下载
      downloadFile (index, row) {
        let self = this
        this.$http.put('/base/file/' + row.id + '/download')
          .then(function (response) {
            self.$refs.filedownload.show()
            self.$refs.filedownload.setPath(row.filePath)
          })
          .catch(function (error) {
            if (error.response.status === 404) {
              self.$message.success('下载失败，数据不存在，请刷新数据再试')
            }
          })
      },
      // tablb 表格删除行
      deleteTableRowClick (index, row) {
        let self = this
        this.$confirm('确定要删除吗, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          this.$http.delete('/base/file/' + row.id)
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
      // 上传
      addTableRowClick () {
        this.$refs.fileupload.show()
      },
      fileUploadSucess () {
        this.searchBtnClick()
        this.$refs.fileupload.hide()
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
