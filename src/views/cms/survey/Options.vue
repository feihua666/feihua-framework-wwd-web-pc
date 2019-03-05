<template>

  <div class="wrapper">
    <el-container>
      <el-main>
        <el-card class="box-card">
          <div  class="text item">
            <label>调查主题：</label>{{survey.title}}
          </div>
          <div  class="text item">
            <label>调查描述：</label>{{survey.description}}
          </div>
          <div  class="text item">
            <label>问题名称：</label>{{question.name}}
          </div>
          <div  class="text item">
            <label>问题类型：</label>{{question.type}}
          </div>
        </el-card>
        <el-collapse value="1">
          <el-collapse-item title="查询条件" name="1">
            <el-form ref="searchForm" :model="searchFormModel" :inline="true" size="small">
              <el-form-item label="关键字" prop="name">
                <el-input  v-model="searchFormModel.name"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchBtnClick">查询</el-button>
                <el-button type="primary" @click="addTableRowClick">添加</el-button>
                <el-button @click="resetFormClick">重置</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <self-table :columns="columns" :tableData="tableData" :page="page" :table-loading="tableLoading" v-on:pageSizeChange="pageSizeChange" v-on:pageNoChange="pageNoChange"></self-table>
      </el-main>
    </el-container>
    <el-dialog
      :title="rowDialogTitle"
      :visible.sync="rowDialogVisible"
      width="400px"
      @before-close="rowDialogVisible = false" style="word-break: break-all;">
      <el-form ref="optionsForm" :model="optionsForm" :rules="optionsFormRules" style="width: 350px;" label-width="100px">
        <el-form-item label="选项名称" prop="name" required>
          <el-input  v-model="optionsForm.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addOrEditOptions" :loading="addLoading">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import SelfPage from '@/components/SelfPage.vue'
  import SelfTable from '@/components/SelfTable.vue'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import { getDictByValueSync } from '@/utils/dictUtils.js'
  export default {
    name: 'Question',
    components: {
      SelfDictSelect,
      SelfTable,
      SelfPage
    },
    data () {
      return {
        addLoading: false,
        rowDialogVisible: false,
        rowDialogTitle: '',
        optionsFormSave: 'add',
        optionsForm: {
          questionId: null,
          name: null
        },
        optionsFormRules: {
          name: [
            {required: true, message: '必填', trigger: 'blur'}
          ]
        },
        question: {
          surveyId: '',
          name: '',
          type: ''
        },
        survey: {
          title: '',
          description: ''
        },
        columns: [
          {
            name: 'name',
            label: '标题'
          },
          {
            name: 'updateAt',
            label: '修改时间'
          },
          {
            label: '操作',
            width: '200',
            buttons: [
              {
                label: '修改',
                click: this.editTableRowClick
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
          questionId: null,
          name: '',
          pageable: true,
          pageNo: 1,
          pageSize: 10
        }
      }
    },
    mounted () {
    },
    methods: {
      loadSurvey (surveyId) {
        let self = this
        self.$http.get('/cms/survey/' + surveyId)
          .then(function (response) {
            let content = response.data.data.content
            self.survey.title = content.title
            self.survey.description = content.description
            self.survey.type = content.type
            self.survey.startTime = content.startTime
            self.survey.endTime = content.endTime
            self.survey.sequence = content.sequence
            self.survey.register = content.register
            self.survey.repeatLimit = content.repeatLimit
            self.survey.url = content.url
          })
      },
      loadQuestion (questionId) {
        let self = this
        self.$http.get('/cms/question/' + questionId)
          .then(function (response) {
            let content = response.data.data.content
            self.question.surveyId = content.surveyId
            self.question.name = content.name
            self.question.description = content.description
            let d = getDictByValueSync(self, 'question_type', content.type)
            self.question.type = (d ? d.name : null)
            self.loadSurvey(content.surveyId)
          })
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
        this.$http.get('/cms/question/optionss', self.searchFormModel)
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
      editTableRowClick (index, row) {
        let self = this
        self.rowDialogTitle = '修改问题选项'
        self.optionsFormSave = 'update'
        self.rowDialogVisible = true
        self.$http.get('/cms/question/options/' + row.id)
          .then(function (response) {
            let content = response.data.data.content
            self.optionsForm.id = content.id
            self.optionsForm.questionId = content.questionId
            self.optionsForm.name = content.name
            self.optionsForm.updateTime = content.updateAt
          })
      },
      addTableRowClick () {
        let self = this
        self.rowDialogTitle = '添加问题选项'
        self.optionsFormSave = 'add'
        self.rowDialogVisible = true
        self.optionsForm.name = null
      },
      addOrEditOptions () {
        let self = this
        if (self.addLoading === false) {
          this.$refs['optionsForm'].validate((valid) => {
            if (valid) {
              // 请求添加
              self.addLoading = true
              if (self.optionsFormSave === 'update') {
                self.$http.put('/cms/question/options/' + self.optionsForm.id, self.optionsForm)
                  .then(function (response) {
                    self.$message.info('选项修改成功')
                    self.addLoading = false
                    self.rowDialogVisible = false
                    self.searchBtnClick()
                  })
                  .catch(function (response) {
                    if (response.response.status === 404) {
                      self.$message.error('选项修改失败，数据不存在或已被他人修改，请刷新列表后再试')
                    }
                    self.addLoading = false
                  })
              } else {
                self.$http.post('/cms/question/options', self.optionsForm)
                  .then(function (response) {
                    self.$message.info('选项添加成功')
                    self.addLoading = false
                    self.rowDialogVisible = false
                    self.searchBtnClick()
                  })
                  .catch(function (response) {
                    self.$message.error('选项添加失败，请稍后再试')
                    self.addLoading = false
                  })
              }
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
          this.$http.delete('/cms/question/options/' + row.id)
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
    },
    // tab切换如果参数不一样，重新加载数据
    beforeRouteEnter (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        if (vm.$route.params.questionId != null) {
          vm.searchFormModel.questionId = vm.$route.params.questionId
          vm.optionsForm.questionId = vm.$route.params.questionId
          vm.loadQuestion(vm.$route.params.questionId)
          vm.loadTableData(1)
        }
      })
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
