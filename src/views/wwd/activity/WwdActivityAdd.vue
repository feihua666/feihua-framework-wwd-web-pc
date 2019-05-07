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
        <el-radio-group v-model="form.type">
          <el-radio-button label="户外">户外</el-radio-button>
          <el-radio-button label="室内">室内</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="身份证" prop="requireIdCard">
        <el-radio-group v-model="form.requireIdCard">
          <el-radio-button label="Y">需要</el-radio-button>
          <el-radio-button label="N">不需要</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model="form.author" style="width: 50%"></el-input>
      </el-form-item>
      <el-form-item label="活动时间" prop="myDateRange">
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
      <el-form-item label="支付类型" prop="payType" required>
        <el-radio-group v-model="form.payType">
          <el-radio-button label="online_pay">线上支付</el-radio-button>
          <el-radio-button label="offline_pay">线下支付</el-radio-button>
        </el-radio-group> 线上：微信支付，线下：自行组织支付
      </el-form-item>
      <el-form-item label="人数规则" prop="headcountRule" required>
        <el-radio-group v-model="form.headcountRule">
          <el-radio-button label="unlimited">不限制</el-radio-button>
          <el-radio-button label="custom">自定义</el-radio-button>
        </el-radio-group> 活动人数男女比例规则
      </el-form-item>
      <el-form-item  v-if="!typeLimit.custHeadcountRule" label="活动人数" prop="headcount" required>
        <el-input-number :min="0" v-model="form.headcount"></el-input-number>默认0为不限人数
      </el-form-item>
      <el-form-item v-if="typeLimit.custHeadcountRule" label="自定义男" prop="headcountMale" required>
        <el-input-number :min="0" v-model="form.headcountMale"></el-input-number> 人
      </el-form-item>
      <el-form-item v-if="typeLimit.custHeadcountRule" label="自定义女" prop="headcountFemale" required>
        <el-input-number :min="0" v-model="form.headcountFemale"></el-input-number> 人
      </el-form-item>
      <el-form-item label="人数说明" prop="headcountDesc">
        <el-input v-model="form.headcountDesc" style="width: 50%"></el-input>
      </el-form-item>
      <el-form-item  label="价格男" prop="malePrice" required>
        <el-input-number :min="1" v-model="form.malePrice"></el-input-number> 元
      </el-form-item>
      <el-form-item label="价格女" prop="femalePrice" required>
        <el-input-number :min="1" v-model="form.femalePrice"></el-input-number> 元
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
        <el-button type="primary" @click="addBtnClick" :loading="addLoading">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import TinymceEditor from '@/components/tinymceEditor/TinymceEditor.vue'
  import FileUpload from '@/components/FileUpload'
  export default {
    components: {SelfDictSelect, TinymceEditor, FileUpload},
    name: 'WwdActivityAdd',
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
          requireIdCard: 'N',
          status: 'editing',
          headcount: 0,
          headcountRule: 'unlimited',
          headcountMale: 0,
          headcountFemale: 0,
          headcountDesc: null,
          malePrice: null,
          femalePrice: null,
          introduced: null,
          payType: 'online_pay',
          activityStatement: null
        },
        addLoading: false,
        typeLimit: {
          custHeadcountRule: false
        },
        formRules: {
          title: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          myDateRange: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          addr: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          malePrice: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          femalePrice: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '必填', trigger: 'blur'}
          ]
        }
      }
    },
    mounted () {
    },
    methods: {
      addBtnClick () {
        let self = this
        if (self.addLoading === false) {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              // 请求添加
              self.addLoading = true
              let activity = {}
              activity.title = self.form.title
              activity.titleUrl = self.form.titleUrl
              activity.author = self.form.author
              activity.addr = self.form.addr
              activity.content = self.form.content
              activity.type = self.form.type
              activity.requireIdCard = self.form.requireIdCard
              activity.status = self.form.status
              activity.headcount = self.form.headcount
              activity.headcountMale = self.form.headcountMale
              activity.headcountFemale = self.form.headcountFemale
              activity.headcountDesc = self.form.headcountDesc
              activity.headcountRule = self.form.headcountRule
              activity.malePrice = self.form.malePrice
              activity.femalePrice = self.form.femalePrice
              activity.introduced = self.form.introduced
              activity.payType = self.form.payType
              activity.activityStatement = self.form.activityStatement
              if (self.form.myDateRange.length === 2) {
                activity.startTime = self.form.myDateRange[0]
                activity.endTime = self.form.myDateRange[1]
              }
              console.log(self.form)
              self.$http.postJson('/wwd/activity', activity)
                .then(function (response) {
                  self.$message.info('活动添加成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  self.$message.error('活动添加失败，请稍后再试')
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
        const isJPG = file.type === 'image/jpeg'
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        return isJPG
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        let dataControl = 'WwdActivityAddLoadData=true'
        if (vm.$utils.loadDataControl.has(dataControl)) {
          // 重置表单
          vm.resetForm()
          vm.$utils.loadDataControl.remove(dataControl)
        }
      })
    },
    watch: {
      'form.headcountRule' (value) {
        let self = this
        let _typeLimit = {
          custHeadcountRule: false
        }
        switch (value) {
          case 'custom':
            _typeLimit.custHeadcountRule = true
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
