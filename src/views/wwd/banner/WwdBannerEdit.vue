<template>

  <div class="fh-page-wrapper">
    <el-form ref="form" class="fh-background-white fh-padding-30" :model="form" :rules="formRules" label-width="100px">
      <el-form-item label="标题图" prop="titleUrl">
        <el-upload style="border: 1px solid #dcdfe6; width: 178px;height: 178px;"
                   class="avatar-uploader"
                   :action="$config.file.uploadUrl"
                   :show-file-list="false"
                   :on-success="handleAvatarSuccess"
                   :before-upload="beforeAvatarUpload">
          <img v-if="imgUrl" :src="imgUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="标题" prop="title" required>
        <el-input v-model="form.title" style="width: 50%"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio-button label="用户">用户</el-radio-button>
          <el-radio-button label="活动">活动</el-radio-button>
          <el-radio-button label="页面">页面</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="跳转链接" prop="redirectUrl" required>
        <el-input v-model="form.redirectUrl" style="width: 50%" :readonly="readonly"></el-input>
        <el-button type="info" @click="selectUserClick" v-if="form.type =='用户'">选择用户</el-button>
        <el-button type="info" @click="selectActivityClick" v-if="form.type =='活动'">选择活动</el-button>
      </el-form-item>
      <el-form-item label="启用状态" prop="status">
        <self-dict-select v-model="form.status" type="yes_no" style="width: 50%"></self-dict-select>
      </el-form-item>
      <el-form-item label="描述" prop="descp" >
        <el-input type="textarea" :autosize="{ minRows: 2}" v-model="form.descp" style="width: 50%"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-check" @click="updateBtnClick" :loading="addLoading">修改</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="选择" :visible.sync="dialogVisible" @before-close="dialogVisible = false">
      <el-main>
        <el-collapse value="1">
          <el-collapse-item title="查询条件" name="1">
            <el-form ref="searchForm" :model="searchFormModel" :inline="true" size="small">
              <el-form-item label="关键字" prop="keyword" v-if="form.type =='用户'">
                <el-input v-model="searchFormModel.keyword"></el-input>
              </el-form-item>
              <el-form-item label="性别" prop="status"v-if="form.type =='用户'">
                <self-dict-select v-model="searchFormModel.gender" type="gender"></self-dict-select>
              </el-form-item>
              <el-form-item label="关键字" prop="title" v-if="form.type =='活动'">
                <el-input v-model="searchFormModel.title"></el-input>
              </el-form-item>
              <el-form-item label="活动状态" prop="status"v-if="form.type =='活动'">
                <self-dict-select v-model="searchFormModel.status" type="activity_status"></self-dict-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="searchBtnClick">查询</el-button>
                <el-button type="warning" icon="el-icon-refresh" @click="resetFormClick">重置</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <self-table @sortChange="sortChange" :default-sort="defaultSort"  :columns="columns" :tableData="tableData" :page="page" :table-loading="tableLoading"
                    v-on:pageSizeChange="pageSizeChange" v-on:pageNoChange="pageNoChange">
        </self-table>
      </el-main>
    </el-dialog>
  </div>
</template>

<script>
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import TinymceEditor from '@/components/tinymceEditor/TinymceEditor.vue'
  import FileUpload from '@/components/FileUpload'
  import SelfPage from '@/components/SelfPage.vue'
  import SelfTable from '@/components/SelfTable.vue'
  export default {
    name: 'WwdBannerEdit',
    components: {SelfDictSelect, TinymceEditor, FileUpload, SelfPage, SelfTable},
    data () {
      return {
        defaultSort: {prop: 'updateAt', order: 'descending'},
        columns: [],
        activityColumns: [
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
            width: '150',
            label: '标题'
          },
          {
            name: 'status',
            dict: 'activity_status',
            label: '状态'
          },
          {
            sortable: 'custom',
            sortBy: 'start_time',
            name: 'startTime',
            width: '150',
            label: '开始时间',
            showInTable: false
          },
          {
            sortable: 'custom',
            sortBy: 'end_time',
            name: 'endTime',
            width: '150',
            label: '结束时间',
            showInTable: false
          },
          {
            sortable: 'custom',
            sortBy: 'update_at',
            name: 'updateAt',
            width: '150',
            label: '更新时间'
          },
          {
            label: '操作',
            width: '120',
            buttons: [
              {
                label: '添加到轮播图',
                styleType: 'primary',
                icon: 'el-icon-edit',
                click: this.tableRowClick
              }
            ]
          }
        ],
        userColumns: [
          {
            type: 'expand'
          },
          {
            name: 'titleUrl',
            width: '100',
            image: true,
            label: '用户图片'
          },
          {
            name: 'wwdUserDto.nickname',
            width: '150',
            label: '用户昵称'
          },
          {
            name: 'wwdUserDto.gender',
            dict: 'gender',
            label: '用户性别'
          },
          {
            sortable: 'custom',
            sortBy: 'update_at',
            name: 'wwdUserDto.updateAt',
            width: '150',
            label: '更新时间'
          },
          {
            label: '操作',
            width: '120',
            buttons: [
              {
                label: '添加到轮播图',
                styleType: 'primary',
                icon: 'el-icon-edit',
                click: this.tableRowClick
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
          gender: '',
          keyword: '',
          title: '',
          status: '',
          pageable: true,
          pageNo: 1,
          pageSize: 10
        },
        dialogVisible: false,
        readonly: true,
        imgUrl: 'http://p3.qhimg.com/t01f9eff21fde930194.png',
        form: {
          title: null,
          titleUrl: 'http://p3.qhimg.com/t01f9eff21fde930194.png',
          redirectUrl: null,
          type: '用户',
          status: 'Y',
          descp: null
        },
        addLoading: false,
        formRules: {
          title: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          titleUrl: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          redirectUrl: [
            {required: true, message: '必填', trigger: 'blur'}
          ]
        }
      }
    },
    mounted () {
      this.id = this.$route.params.id
      this.loadEditData(this.id)
    },
    methods: {
      tableRowClick (index, row) {
        let self = this
        this.$confirm('确定要添加至轮播图, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          //
          console.log(row)
          if (self.form.type === '用户') {
            //
            self.imgUrl = row.titleUrl
            self.form.titleUrl = row.titleUrl
            self.form.title = row.wwdUserDto.nickname
            self.form.redirectUrl = '/pages/detail/detail?wwdUserId=' + row.wwdUserDto.id
          } else {
            self.imgUrl = row.titleUrl
            self.form.titleUrl = row.titleUrl
            self.form.title = row.title
            self.form.redirectUrl = '/pages/activity/detail?id=' + row.id
          }
          self.dialogVisible = false
        })
      },
      selectUserClick () {
        this.dialogVisible = true
        this.tableData = []
        this.columns = this.userColumns
        this.searchFormModel.queryUrl = '/wwd/users'
        this.loadTableData(1)
      },
      selectActivityClick () {
        this.dialogVisible = true
        this.tableData = []
        this.columns = this.activityColumns
        this.searchFormModel.queryUrl = '/wwd/activitys'
        this.loadTableData(1)
      },
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
        this.$http.get(self.searchFormModel.queryUrl, self.searchFormModel)
          .then(function (response) {
            let content = response.data.data.content
            if (self.form.type === '用户') {
              content.forEach(function (user) {
                let pics = user.wwdUserPicDtos
                pics.forEach(function (pic) {
                  if (pic.type === 'main') {
                    user.titleUrl = pic.picOriginUrl
                    return false
                  }
                })
              })
            }
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
      loadEditData (id) {
        let self = this
        // this.resetForm()
        self.formDataLoading = true
        self.$http.get('/wwd/banner/' + id)
          .then(function (response) {
            let content = response.data.data.content
            self.form.id = content.id
            self.form.title = content.title
            self.form.titleUrl = content.titleUrl
            self.form.redirectUrl = content.redirectUrl
            self.form.type = content.type
            self.form.status = content.status
            self.form.descp = content.descp
            self.imgUrl = self.$config.file.getDownloadUrl(content.titleUrl)
            self.formDataLoading = false
            return Promise.resolve(content)
          }).catch(function (response) {
            self.formDataLoading = false
          })
      },
      updateBtnClick () {
        let self = this
        if (self.addLoading === false) {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              // 请求添加
              self.addLoading = true
              self.$http.put('/wwd/banner/' + self.id, self.form)
                .then(function (response) {
                  self.$message.info('修改成功')
                  self.addLoading = false
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
      resetForm () {
        this.$refs['form'].resetFields()
      },
      handleAvatarSuccess (res, file) {
        let titleUrl = res.data.content.path
        this.form.titleUrl = titleUrl
        this.imgUrl = this.$config.file.getDownloadUrl(titleUrl)
      },
      beforeAvatarUpload (file) {
        const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png')
        if (!isJPG) {
          this.$message.error('图片只能是 JP或png 格式!')
        }
        return isJPG
      }
    },
    // tab切换如果参数不一样，重新加载数据
    beforeRouteEnter (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        if (vm.id !== vm.$route.params.id) {
          vm.id = vm.$route.params.id
          vm.loadEditData(vm.id)
        }
      })
    },
    watch: {
      'form.type' (value) {
        if (value === '页面') {
          this.readonly = false
        } else {
          this.readonly = true
        }
        this.form.redirectUrl = ''
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
