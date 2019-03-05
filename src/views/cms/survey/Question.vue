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
        </el-card>
        <el-collapse value="1">
          <el-collapse-item title="查询条件" name="1">
            <el-form ref="searchForm" :model="searchFormModel" :inline="true" size="small">
              <el-form-item label="关键字" prop="name">
                <el-input  v-model="searchFormModel.name"></el-input>
              </el-form-item>
              <el-form-item label="类型" prop="type">
                <self-dict-select v-model="searchFormModel.type" type="question_type"></self-dict-select>
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
  </div>
</template>

<script>
  import SelfPage from '@/components/SelfPage.vue'
  import SelfTable from '@/components/SelfTable.vue'
  import loadDataControl from '@/utils/storeLoadDataControlUtils.js'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  export default {
    name: 'Question',
    components: {
      SelfDictSelect,
      SelfTable,
      SelfPage
    },
    data () {
      return {
        survey: {
          title: null,
          description: null
        },
        columns: [
          {
            name: 'name',
            label: '问题标题'
          },
          {
            name: 'type',
            dict: 'question_type',
            label: '问题类型'
          },
          {
            name: 'sequence',
            label: '排序'
          },
          {
            name: 'br',
            dict: 'yes_no',
            label: '换行'
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
                label: '添加选择',
                click: this.addOptionsTableRowClick
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
          surveyId: null,
          name: '',
          type: '',
          pageable: true,
          orderable: true,
          orderby: 'sequence-desc,update_at-desc',
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
        this.$http.get('/cms/questions', self.searchFormModel)
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
      addOptionsTableRowClick (index, row) {
        let self = this
        if (row.type === 'text') {
          self.$alert('当前问题为文本类型，不需要添加选项哦！', '提示', {
            confirmButtonText: '关闭',
            type: 'warning'
          }).then(() => {
          })
        } else {
          self.$router.push('/Main/Cms/Options/' + row.id)
        }
      },
      editTableRowClick (index, row) {
        this.$router.push('/Main/Cms/QuestionEdit/' + row.id)
      },
      addTableRowClick () {
        let self = this
        loadDataControl.add(self.$store, 'QuestionAddLoadData=true')
        self.$router.push('/Main/Cms/QuestionAdd/' + self.searchFormModel.surveyId)
      },
      // tablb 表格删除行
      deleteTableRowClick (index, row) {
        let self = this
        this.$confirm('确定要删除吗, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          this.$http.delete('/cms/questions/' + row.id)
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
        if (vm.$route.params.id != null) {
          vm.searchFormModel.surveyId = vm.$route.params.id
          vm.loadSurvey(vm.$route.params.id)
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
