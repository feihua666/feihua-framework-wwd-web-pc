<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" :rules="formRules" style="width: 460px;" label-width="100px" v-loading="formDataLoading">
      <el-form-item label="开始时间" prop="startTime" required>
        <el-date-picker disabled
          v-model="form.startTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime" required>
        <el-date-picker disabled
          v-model="form.endTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="请假类型" prop="leaveType">
        <self-dict-select disabled v-model="form.leaveType" type="oa_workattendance_leave_type"></self-dict-select>
      </el-form-item>
      <el-form-item label="请假理由" prop="reason" required>
        <el-input disabled  v-model="form.reason"></el-input>
      </el-form-item>
      <el-form-item label="审批意见" prop="comment" required>
        <el-input type="textArea"  v-model="form.comment"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="agreeClick" :loading="addLoading">同意</el-button>
        <el-button type="primary" @click="notAgreeClick" :loading="notAgreeLoading">不同意</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import OfficeInputSelect from '@/views/office/OfficeInputSelect'
  export default {
    name: 'DataScopeEdit',
    components: {
      SelfDictSelect, OfficeInputSelect},
    data () {
      return {
        // 编辑的id
        id: null,
        form: {
          startTime: null,
          endTime: null,
          leaveType: '',
          reason: null
        },
        formDataLoading: false,
        addLoading: false,
        notAgreeLoading: false,
        formRules: {
          comment: [
            {required: true, message: '必填', trigger: 'blur'}
          ]
        }
      }
    },
    mounted () {
      this.id = this.$route.query.businessId
      this.loadEditData(this.id)
    },
    methods: {
      loadEditData (id) {
        this.resetForm()
        let self = this
        self.formDataLoading = true
        self.$http.get('/oa/workattendance/leave/' + self.id)
          .then(function (response) {
            let content = response.data.data.content
            self.form.startTime = content.startTime
            self.form.endTime = content.endTime
            self.form.leaveType = content.leaveType
            self.form.reason = content.reason
            self.form.updateTime = content.updateAt
            self.formDataLoading = false
            return Promise.resolve(content)
          })
          .catch(function (response) {
            self.formDataLoading = false
          })
      },
      agreeClick () {
        this.doAduit('1')
      },
      notAgreeClick () {
        this.doAduit('0')
      },
      doAduit (flag) {
        let self = this
        let data = {
          businessId: self.$route.query.businessId,
          comment: self.form.comment,
          flag: flag,
          taskId: self.$route.query.taskId,
          taskName: self.$route.query.taskName,
          taskDefKey: self.$route.query.taskDefKey,
          procInsId: self.$route.query.procInsId,
          procDefId: self.$route.query.procDefId,
          status: self.$route.query.status
        }
        this.$refs['form'].validate((valid) => {
          if (valid) {
            // 请求添加
            if (flag === '1') {
              self.addLoading = true
            }
            if (flag === '0') {
              self.notAgreeLoading = true
            }
            self.$http.post('/oa/workattendance/leave/' + self.id + '/aduit', data)
              .then(function (response) {
                self.$message.info('请假单审核成功')
                if (flag === '1') {
                  self.addLoading = false
                }
                if (flag === '0') {
                  self.notAgreeLoading = false
                }
              })
              .catch(function (response) {
                if (flag === '1') {
                  self.addLoading = false
                }
                if (flag === '0') {
                  self.notAgreeLoading = false
                }
              })
          } else {
            return false
          }
        })
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
        if (vm.id !== vm.$route.query.businessId) {
          vm.id = vm.$route.query.businessId
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
