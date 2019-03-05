<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" :rules="formRules" style="width: 500px;" label-width="100px">
      <el-form-item label="调查主题" prop="title" required>
        <el-input  v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="调查描述" prop="description">
        <el-input type="textarea" v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="调查类型" prop="type" required>
        <SelfDictSelect  v-model="form.type" type="survey_type"></SelfDictSelect>
      </el-form-item>
      <el-form-item label="调查时间" prop="myDateRange">
        <el-date-picker
          :picker-options="pickerOptions"
          v-model="form.myDateRange"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="排序" prop="sequence">
        <el-input-number  :min="0" v-model="form.sequence" style="width: 100%;"></el-input-number>
      </el-form-item>
      <el-form-item label="注册可参与" prop="register" required>
        <SelfDictSelect  v-model="form.register" type="yes_no"></SelfDictSelect>
      </el-form-item>
      <el-form-item label="可重复参与" prop="repeatLimit" required>
        <SelfDictSelect  v-model="form.repeatLimit" type="yes_no"></SelfDictSelect>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateBtnClick" :loading="addLoading">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  export default {
    components: {
      SelfDictSelect
    },
    name: 'SurveyEdit',
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
        form: {
          myDateRange: '',
          title: null,
          description: null,
          type: null,
          startTime: null,
          endTime: null,
          sequence: 0,
          register: 'N',
          repeatLimit: 0,
          url: null
        },
        addLoading: false,
        formRules: {
          title: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '必填', trigger: 'change'}
          ],
          startTime: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          register: [
            {required: true, message: '必填', trigger: 'change'}
          ],
          repeatLimit: [
            {required: true, message: '必填', trigger: 'change'}
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
        let self = this
        self.resetForm()
        self.formDataLoading = true
        self.$http.get('/cms/survey/' + self.id)
          .then(function (response) {
            let content = response.data.data.content
            self.form.id = content.id
            self.form.title = content.title
            self.form.description = content.description
            self.form.type = content.type
            self.form.startTime = content.startTime
            self.form.endTime = content.endTime
            self.form.sequence = content.sequence
            self.form.register = content.register
            self.form.repeatLimit = content.repeatLimit
            self.form.url = content.url
            self.form.updateTime = content.updateAt
            self.formDataLoading = false
            if (content.startTime !== null && content.endTime !== null) {
              self.form.myDateRange = [content.startTime, content.endTime]
            }
          })
          .catch(function (response) {
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
              let survey = {}
              survey.id = self.form.id
              survey.title = self.form.title
              survey.description = self.form.description
              survey.type = self.form.type
              if (self.form.myDateRange.length === 2) {
                survey.startTime = self.form.myDateRange[0]
                survey.endTime = self.form.myDateRange[1]
              }
              survey.sequence = self.form.sequence
              survey.register = self.form.register
              survey.repeatLimit = self.form.repeatLimit
              survey.url = self.form.url
              survey.updateTime = self.form.updateAt
              self.$http.put('/cms/survey/' + self.id, survey, {'dataType': 'json'})
                .then(function (response) {
                  self.$message.info('调查修改成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  if (response.response.status === 404) {
                    self.$message.error('调查修改失败，数据不存在或已被他人修改，请刷新列表后再试')
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
      }
    },
    watch: {
      myDateRange (val) {
        let self = this
        if (val != null && val.length === 2) {
          self.form.startTime = val[0]
          self.form.endTime = val[1]
        }
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
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrapper{
  padding:1.5rem;
}
</style>
