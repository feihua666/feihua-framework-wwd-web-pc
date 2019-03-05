<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" :rules="formRules" style="width: 460px;" label-width="100px">
      <el-form-item label="开始时间" prop="startTime" required>
        <el-date-picker
          v-model="form.startTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime" required>
        <el-date-picker
          v-model="form.endTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="请假类型" prop="leaveType">
        <self-dict-select v-model="form.leaveType" type="oa_workattendance_leave_type"></self-dict-select>
      </el-form-item>
      <el-form-item label="请假理由" prop="reason" required>
        <el-input  v-model="form.reason"></el-input>
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
  import OfficeInputSelect from '@/views/office/OfficeInputSelect'
  export default {
    components: {
      SelfDictSelect, OfficeInputSelect },
    name: 'LeaveAdd',
    data () {
      return {
        form: {
          startTime: null,
          endTime: null,
          leaveType: '',
          reason: null
        },
        addLoading: false,
        formRules: {
          startTime: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          endTime: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          leaveType: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          reason: [
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
              self.$http.post('/oa/workattendance/leave', self.form)
                .then(function (response) {
                  self.$message.info('请假单添加成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  self.$message.error('请假单添加失败，请稍后再试')
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
        let dataControl = 'LeaveAddLoadData=true'
        if (loadDataControl.has(vm.$store, dataControl)) {
          // 重置表单
          vm.resetForm()
          loadDataControl.remove(vm.$store, dataControl)
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
