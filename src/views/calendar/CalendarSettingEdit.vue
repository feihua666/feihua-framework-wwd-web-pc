<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" :rules="formRules" style="width: 460px;" label-width="100px">
      <el-form-item label="年" prop="year" required>
        <el-input readonly  v-model="form.year"></el-input>
      </el-form-item>
      <el-form-item label="月" prop="month" required>
        <el-input readonly  v-model="form.month"></el-input>
      </el-form-item>
      <el-form-item label="日" prop="day" required>
        <el-input readonly v-model="form.day"></el-input>
      </el-form-item>
      <el-form-item label="*作息" prop="workOrRest">
        <self-dict-select v-model="form.workOrRest" type="work_or_rest"></self-dict-select>
      </el-form-item>
      <el-form-item label="*节假日" prop="holiday">
        <el-input  v-model="form.holiday"></el-input>
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
    name: 'CalendarSettingEdit',
    data () {
      let validateworkOrRest = (rule, value, callback) => {
        if ((value === '' || value === null) && (this.form.holiday === '' || this.form.holiday === null)) {
          callback(new Error('作息和节假日至少填一项'))
        } else {
          callback()
        }
      }
      let validateHoliday = (rule, value, callback) => {
        if ((value === '' || value === null) && (this.form.workOrRest === '' || this.form.workOrRest === null)) {
          callback(new Error('作息和节假日至少填一项'))
        } else {
          callback()
        }
      }
      return {
        form: {
          year: null,
          month: null,
          day: null,
          workOrRest: null,
          holiday: null
        },
        addLoading: false,
        formRules: {
          year: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          month: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          day: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          workOrRest: [
            {validator: validateworkOrRest, trigger: 'blur'}
          ],
          holiday: [
            {validator: validateHoliday, trigger: 'blur'}
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
        self.$http.get('/base/calendarextend/' + self.id)
          .then(function (response) {
            let content = response.data.data.content
            self.form.year = content.year
            self.form.month = content.month
            self.form.day = content.day
            self.form.workOrRest = content.workOrRest
            self.form.holiday = content.holiday
            self.form.updateTime = content.updateAt
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
              self.$http.put('/base/calendarextend/' + self.id, self.form)
                .then(function (response) {
                  self.$message.info('日历扩展修改成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  if (response.response.status === 409) {
                    self.$message.error('日历扩展添加失败，日期已存在')
                  } else if (response.response.status === 404) {
                    self.$message.error('日历扩展修改失败，数据不存在或已被他人修改，请刷新列表后再试')
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
    },
    // tab切换如果参数不一样，重新加载数据
    beforeRouteEnter  (to, from, next) {
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
