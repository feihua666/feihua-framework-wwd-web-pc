<template>

  <div class="wrapper">
    <el-container>
      <el-main>
        <el-card class="box-card">
          <div  class="text item">
            <label>活动名称：</label>{{activity.title}}
          </div>
          <div  class="text item">
            <label>活动简介：</label>{{activity.introduced}}
          </div>
          <div  class="text item">
            <label>活动状态：</label>
            <el-radio-group  v-model="activity.status" disabled size="small">
              <el-radio-button label="editing">编辑中</el-radio-button>
              <el-radio-button label="signing">报名中</el-radio-button>
              <el-radio-button label="signfull">名额满</el-radio-button>
              <el-radio-button label="finished">已结束</el-radio-button>
            </el-radio-group>
          </div>
        </el-card>
        <el-collapse value="1">
          <el-collapse-item title="查询条件" name="1">
            <el-form ref="searchForm" :model="searchFormModel" :inline="true" size="small">
              <el-form-item label="关键字" prop="keyword">
                <el-input  v-model="searchFormModel.keyword"></el-input>
              </el-form-item>
              <el-form-item>
                <self-dict-select v-model="searchFormModel.payStatus" type="wwd_pay_status"></self-dict-select>
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
      <el-dialog
        title="活动参与修改"
        :visible.sync="rowDialogVisible"
        width="400px"
        @before-close="rowDialogVisible = false" style="word-break: break-all;">
        <el-form ref="form" :model="form" :rules="formRules" label-width="100px">
          <el-form-item label="领队" prop="type" required>
            <el-radio-group v-model="form.type">
              <el-radio-button label="Y">是</el-radio-button>
              <el-radio-button label="N">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="支付状态" prop="payStatus" required>
            <self-dict-select v-model="form.payStatus" type="wwd_pay_status"></self-dict-select>
          </el-form-item>
          <el-form-item label="用户状态" prop="status" required>
            <self-dict-select v-model="form.status" type="wwd_part_status"></self-dict-select>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input type="textarea" :autosize="{ minRows: 2}" v-model="form.remarks"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="editClick" :loading="addLoading">保存</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
  import SelfPage from '@/components/SelfPage.vue'
  import SelfTable from '@/components/SelfTable.vue'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  export default {
    name: 'WwdParticipate',
    components: {
      SelfDictSelect,
      SelfTable,
      SelfPage
    },
    data () {
      return {
        rowDialogVisible: false,
        addLoading: false,
        form: {
          remarks: null,
          payStatus: '',
          type: 'N',
          status: ''
        },
        formRules: {
          payStatus: [
            {required: true, message: '必填', trigger: 'blur'}
          ]
        },
        activity: {
          title: null,
          introduced: null,
          status: ''
        },
        columns: [
          {
            name: 'baseUserDto.photo',
            image: true,
            label: '用户头像'
          },
          {
            name: 'wwdUserDto.name',
            label: '用户名'
          },
          {
            name: 'wwdUserDto.gender',
            dict: 'gender',
            label: '用户性别'
          },
          {
            name: 'type',
            dict: 'yes_no',
            label: '是否领队'
          },
          {
            name: 'payStatus',
            dict: 'wwd_pay_status',
            label: '用户支付状态'
          },
          {
            name: 'status',
            dict: 'wwd_part_status',
            label: '用户状态'
          },
          {
            name: 'remarks',
            label: '备注'
          },
          {
            name: 'updateAt',
            label: '修改时间'
          },

          {
            name: 'name',
            label: '报名姓名'
          },
          {
            name: 'mobile',
            label: '报名手机号'
          },
          {
            label: '操作',
            width: '200',
            buttons: [
              {
                label: '修改',
                click: this.editTableRowClick
              }/*,
              {
                label: '删除',
                click: this.deleteTableRowClick
              } */
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
          wwdActivityId: null,
          keyword: '',
          payStatus: 'paid',
          pageable: true,
          orderable: true,
          orderby: 'update_at-desc',
          pageNo: 1,
          pageSize: 10
        }
      }
    },
    mounted () {

    },
    methods: {
      photoFormatter (row) {
        let url = null
        if (row.baseUserDto && row.baseUserDto.photo) {
          url = this.$config.file.getDownloadUrl(row.baseUserDto.photo)
        } else {
          url = require('@/assets/index/headPic.jpg')
        }
        return '<img width="75px" height="75px" src="' + url + '"/>'
      },
      loadWwdParticipate (activityId) {
        let self = this
        self.$http.get('/wwd/activity/' + activityId)
          .then(function (response) {
            let content = response.data.data.content
            self.activity.id = content.id
            self.activity.title = content.title
            self.activity.introduced = content.introduced
            self.activity.status = content.status
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
        this.$http.get('/wwd/participates', self.searchFormModel)
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
        self.rowDialogVisible = true
        self.$http.get('/wwd/participate/' + row.id)
          .then(function (response) {
            let content = response.data.data.content
            self.form.id = content.id
            self.form.payStatus = content.payStatus
            self.form.status = content.status
            self.form.type = content.type
            self.form.remarks = content.remarks
            self.form.updateTime = content.updateAt
          })
      },
      editClick () {
        let self = this
        if (self.addLoading === false) {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              // 请求添加
              self.addLoading = true
              self.$http.put('/wwd/participate/' + self.form.id, self.form)
                .then(function (response) {
                  self.$message.info('修改成功')
                  self.addLoading = false
                  self.searchBtnClick()
                })
                .catch(function (response) {
                  if (response.response.status === 404) {
                    self.$message.error('修改失败，数据不存在或已被他人修改，请刷新列表后再试')
                  }
                  self.addLoading = false
                })
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
          this.$http.delete('/wwd/participate/' + row.id)
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
          vm.searchFormModel.wwdActivityId = vm.$route.params.id
          vm.loadWwdParticipate(vm.$route.params.id)
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
  .el-radio-button__orig-radio:disabled:checked+.el-radio-button__inner {
    background-color: #409EFF;
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
