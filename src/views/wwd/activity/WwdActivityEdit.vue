<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" :rules="formRules" label-width="100px">
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
      <el-form-item label="活动标题" prop="title" required>
        <el-input v-model="form.title" style="width: 50%"></el-input>
      </el-form-item>
      <el-form-item label="活动类型" prop="type">
        <el-radio-group v-model="form.type" size="small">
          <el-radio-button label="户外">户外</el-radio-button>
          <el-radio-button label="室内">室内</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="作者" prop="author">
        <el-input v-model="form.author" style="width: 50%"></el-input>
      </el-form-item>
      <el-form-item label="活动时间" prop="myDateRange" required>
        <el-date-picker style="width: 50%"
                        :picker-options="pickerOptions"
                        v-model="form.myDateRange"
                        type="datetimerange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="活动地点" prop="addr" required>
        <el-input v-model="form.addr" style="width: 50%"></el-input>
      </el-form-item>
      <el-form-item label="活动人数" prop="headcount">
        <el-input-number :min="0" v-model="form.headcount"></el-input-number>默认0为不限人数
      </el-form-item>
      <el-form-item label="人数说明" prop="headcountDesc">
        <el-input v-model="form.headcountDesc" style="width: 50%"></el-input>
      </el-form-item>
      <el-form-item label="支付规则" prop="payRule" required>
        <el-radio-group v-model="form.payRule" size="small">
          <el-radio-button label="1">人均</el-radio-button>
          <el-radio-button label="2">自定义</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="!typeLimit.custPayRule" label="人均价格" prop="price" required>
        <el-input-number v-model="form.price"></el-input-number>
      </el-form-item>
      <el-form-item v-if="typeLimit.custPayRule" label="自定义男" prop="malePrice" required>
        <el-input-number :min="1" v-model="form.malePrice"></el-input-number>
      </el-form-item>
      <el-form-item v-if="typeLimit.custPayRule" label="自定义女" prop="femalePrice" required>
        <el-input-number :min="1" v-model="form.femalePrice"></el-input-number>
      </el-form-item>
      <el-form-item label="活动内容" prop="content" required>
        <tinymce-editor v-model="form.content"></tinymce-editor>
      </el-form-item>
      <el-form-item label="活动简介" prop="introduced">
        <el-input type="textarea" :autosize="{ minRows: 2}" v-model="form.introduced"></el-input>
      </el-form-item>
      <el-form-item label="活动声明" prop="activityStatement">
        <el-input type="textarea" :autosize="{ minRows: 2}" v-model="form.activityStatement"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateBtnClick" :loading="addLoading">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import TinymceEditor from '@/components/tinymceEditor/TinymceEditor.vue'
  import FileUpload from '@/components/FileUpload'

  export default {
    name: 'WwdActivityEdit',
    components: {SelfDictSelect, TinymceEditor, FileUpload},
    data () {
      let dateTime = new Date()
      dateTime = dateTime.setDate(dateTime.getDate() - 1)
      dateTime = new Date(dateTime)
      return {
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() < dateTime.getTime()
          }
        },
        imgUrl: '',
        form: {
          myDateRange: '',
          title: null,
          titleUrl: null,
          author: null,
          startTime: null,
          endTime: null,
          addr: null,
          content: null,
          type: '户外',
          status: '1',
          headcount: 0,
          headcountDesc: null,
          payRule: '1',
          price: null,
          malePrice: null,
          femalePrice: null,
          introduced: null,
          activityStatement: null
        },
        addLoading: false,
        typeLimit: {
          custPayRule: false
        },
        formRules: {
          title: [
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
      loadEditData (id) {
        this.resetForm()
        let self = this
        self.formDataLoading = true
        self.$http.get('/wwd/activity/' + self.id)
          .then(function (response) {
            let content = response.data.data.content
            self.form.id = content.id
            self.form.title = content.title
            self.form.titleUrl = content.titleUrl
            self.imgUrl = self.$config.file.getDownloadUrl(content.titleUrl)
            self.form.author = content.author
            self.form.addr = content.addr
            self.form.content = content.content
            self.form.type = content.type
            self.form.status = content.status
            self.form.headcount = content.headcount
            self.form.headcountDesc = content.headcountDesc
            self.form.payRule = content.payRule
            self.form.price = content.price
            self.form.malePrice = content.malePrice
            self.form.femalePrice = content.femalePrice
            self.form.activityStatement = content.activityStatement
            self.form.introduced = content.introduced
            self.form.updateTime = content.updateAt
            if (content.startTime !== null && content.endTime !== null) {
              self.form.myDateRange = [content.startTime, content.endTime]
            }
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
              self.form.id = self.id
              let activity = {}
              activity.id = self.id
              activity.title = self.form.title
              activity.titleUrl = self.form.titleUrl
              activity.author = self.form.author
              activity.addr = self.form.addr
              activity.content = self.form.content
              activity.type = self.form.type
              activity.status = self.form.status
              activity.headcount = self.form.headcount
              activity.headcountDesc = self.form.headcountDesc
              activity.payRule = self.form.payRule
              activity.price = self.form.price
              activity.malePrice = self.form.malePrice
              activity.femalePrice = self.form.femalePrice
              activity.introduced = self.form.introduced
              activity.activityStatement = self.form.activityStatement
              if (self.form.myDateRange.length === 2) {
                activity.startTime = self.form.myDateRange[0]
                activity.endTime = self.form.myDateRange[1]
              }
              self.$http.put('/wwd/activity/' + self.id, activity, {'dataType': 'json'})
                .then(function (response) {
                  self.$message.info('活动修改成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  if (response.response.status === 404) {
                    self.$message.error('活动修改失败，数据不存在或已被他人修改，请刷新列表后再试')
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
        this.imgUrl = self.$config.file.getDownloadUrl(titleUrl)
      },
      beforeAvatarUpload (file) {
        const isJPG = file.type === 'image/jpeg'
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
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
      'form.payRule' (value) {
        let self = this
        let _typeLimit = {
          custPayRule: false
        }
        switch (value) {
          case '2':
            _typeLimit.custPayRule = true
            break
        }

        // 将数据清除
        for (let key in _typeLimit) {
          if (_typeLimit[key] === false) {
            self.form[key] = null
          }
        }
        self.typeLimit = _typeLimit
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .wrapper {
    padding: 1.5rem;
    overflow: auto;
    height: 100%;
  }
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
