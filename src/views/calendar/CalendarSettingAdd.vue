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
        <el-button type="primary" @click="addBtnClick" :loading="addLoading">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import loadDataControl from '@/utils/storeLoadDataControlUtils.js'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  export default {
    components: {
      SelfDictSelect
    },
    name: 'CalendarSettingAdd',
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
    },
    methods: {
      addBtnClick () {
        let self = this
        if (self.addLoading === false) {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              // 请求添加
              self.addLoading = true
              self.$http.post('/base/calendarextend', self.form)
                .then(function (response) {
                  self.$message.info('日历扩展添加成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  if (response.response.status === 409) {
                    self.$message.error('日历扩展添加失败，日期已存在')
                  } else {
                    self.$message.error('日历扩展添加失败，请稍后再试')
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
    computed: {
    },
    watch: {
    },
    beforeRouteEnter  (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        let dataControl = 'CalendarSettingAddLoadData=true'
        if (loadDataControl.has(vm.$store, dataControl)) {
          // 重置表单
          vm.resetForm()
          loadDataControl.remove(vm.$store, dataControl)
        }
        let dateStr = vm.$route.params.date
        let dateArray = dateStr.split('-')
        vm.form.year = dateArray[0]
        vm.form.month = dateArray[1]
        vm.form.day = dateArray[2]
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
