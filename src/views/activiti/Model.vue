<template>
  <div class="wrapper">
    <el-container>
      <el-main>
        <el-collapse value="1">
          <el-collapse-item title="查询条件" name="1">
            <el-form ref="searchForm" :model="searchFormModel" :inline="true" size="small">
              <el-form-item label="模型名称">
                <el-input  v-model="searchFormModel.name"></el-input>
              </el-form-item>
              <el-form-item label="模型类型">
                <self-dict-select v-model="searchFormModel.category" type="activity_process_category"></self-dict-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchBtnClick">查询</el-button>
                <el-button type="primary" @click="createModelClick">新建模型</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <self-table id="modeltable" :columns="columns" :tableData="tableData" :page="page" :table-loading="tableLoading" v-on:pageSizeChange="pageSizeChange" v-on:pageNoChange="pageNoChange"></self-table>
      </el-main>
    </el-container>

    <category-dialog :submit-click="setCategorySubmit" ref="categorydialog"></category-dialog>
    <file-download-dialog ref="exportfiledownload"></file-download-dialog>
  </div>
</template>

<script>
  import SelfPage from '@/components/SelfPage.vue'
  import SelfTable from '@/components/SelfTable.vue'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import CategoryDialog from './CategoryDialog'
  import FileDownloadDialog from '@/components/FileDownloadDialog'
  export default {
    name: 'Model',
    components: {
      FileDownloadDialog,
      CategoryDialog,
      SelfDictSelect,
      SelfTable,
      SelfPage
    },
    data () {
      return {
        columns: [
          {
            name: 'category',
            label: '流程分类',
            dict: 'activity_process_category'
          },
          {
            name: 'id',
            label: '模型ID'
          },
          {
            name: 'key',
            label: '模型标识'
          },
          {
            name: 'name',
            label: '模型名称'
          },
          {
            name: 'version',
            label: '版本号'
          },
          {
            name: 'createTime',
            label: '创建时间'
          },
          {
            name: 'lastUpdateTime',
            label: '最后更新时间'
          },
          {
            label: '操作',
            buttons: [
              {
                label: '设置分类',
                click: this.setCategaryClick
              },
              {
                label: '编辑',
                click: this.editClick
              },
              {
                label: '部署',
                click: this.deployClick
              },
              {
                label: '导出',
                click: this.exportClick
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
          category: '',
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
        this.$http.get('/activity/models', self.searchFormModel)
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
      // 新建模型按钮
      createModelClick () {
        let self = this
        self.$http.post('/activity/model')
          .then(response => {
            let content = response.data.data.content
            window.open('/static/activity/modeler.html?modelId=' + content.id)
          }).catch(error => {
            if (error && error.response && error.response.status === 404) {
              self.$message.error('创建模型数据失败')
            }
          })
      },
      // 设置分类
      setCategaryClick (index, row) {
        this.$refs.categorydialog.show()
        this.$refs.categorydialog.setCategory(row.category)
        this.$refs.categorydialog.setParam(row.id)
      },
      setCategorySubmit (category, id) {
        let self = this
        this.$http.put('/activity/model/' + id + '/category', {category: category})
          .then(response => {
            self.$message.success('更新成功')
            self.searchBtnClick()
            self.$refs.categorydialog.hide()
          })
      },
      // 编辑
      editClick (index, row) {
        window.open('/static/activity/modeler.html?modelId=' + row.id)
      },
      // 部署
      deployClick (index, row) {
        let self = this
        this.$confirm('确定要部署该模型吗?', '提示', {
          type: 'warning'
        }).then(() => {
          const loading = self.$loading({
            lock: true,
            text: '部署中，请稍候...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)',
            target: '#modeltable'
          })
          self.$http.post('/activity/model/' + row.id + '/deploy')
            .then(response => {
              self.$message.success('部署成功')
              loading.close()
            }).catch(error => {
              if (error) {
                if (error.response.status === 400) {
                  self.$message.error('部署失败，流程图不正确')
                }
                if (error.response.status === 404) {
                  self.$message.error('部署失败，未找到资源')
                }
              }
              loading.close()
            })
        })
      },
      // 导出
      exportClick (index, row) {
        let self = this
        this.$confirm('确定要导出该模型吗?', '提示', {
          type: 'warning'
        }).then(() => {
          self.$http.get('/activity/model/' + row.id + '/export')
            .then(response => {
              let content = response.data.data.content
              self.$refs.exportfiledownload.setPath(content)
              self.$refs.exportfiledownload.show()
            })
        })
      },
      deleteTableRowClick (index, row) {
        let self = this
        this.$prompt('请输入删除原因', '提示', {
          inputErrorMessage: '请输入删除原因',
          inputValidator: function (value) {
            return !!value
          }
        }).then(({value}) => {
          this.$http.delete('/activity/model/' + row.id, {deleteReason: value})
            .then(function (response) {
              self.$message.success('删除成功')
              // 重新加载数据
              self.searchBtnClick()
            }).catch()
        })
      }
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
</style>
