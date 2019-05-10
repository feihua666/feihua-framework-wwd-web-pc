<template>
    <div class="wrapper">
      <el-form ref="form" :model="form" :rules="formRules" style="width: 460px;" label-width="150px"
               v-loading="formDataLoading">
        <el-form-item label="任务名称" prop="name">
          <el-input  v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="任务名称英文" prop="jobName">
          <el-input  v-model="form.jobName"></el-input>
        </el-form-item>
        <el-form-item label="任务class" prop="jobClass">
          <el-input  v-model="form.jobClass"></el-input>
        </el-form-item>
        <el-form-item label="任务组" prop="jobGroup">
          <el-input  v-model="form.jobGroup"></el-input>
        </el-form-item>
        <el-form-item label="触发器名称英文" prop="triggerName">
          <el-input  v-model="form.triggerName"></el-input>
        </el-form-item>
        <el-form-item label="触发器组" prop="triggerGroup">
          <el-input  v-model="form.triggerGroup"></el-input>
        </el-form-item>
        <el-form-item label="cron表达式" prop="triggerCronExpression">
          <el-input  v-model="form.triggerCronExpression"></el-input>
        </el-form-item>
        <el-form-item label="cron表达式描述" prop="triggerCronExpressionDesc">
          <el-input  v-model="form.triggerCronExpressionDesc"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input  v-model="form.description"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="updateBtnClick" :loading="addLoading">修改</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import OfficeInputSelect from '@/views/office/OfficeInputSelect'

  export default {
    name: 'SchedulerEdit',
    components: {
      SelfDictSelect, OfficeInputSelect
    },
    data () {
      return {
        // 编辑的id
        id: null,
        form: {
          id: '',
          name: '',
          jobName: '',
          jobClass: '',
          jobGroup: '',
          triggerName: '',
          triggerGroup: '',
          triggerCronExpression: '',
          triggerCronExpressionDesc: '',
          description: '',
          updateTime: null
        },
        formDataLoading: false,
        addLoading: false,
        formRules: {
          name: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          jobName: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          jobClass: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          jobGroup: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          triggerName: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          triggerGroup: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          triggerCronExpression: [
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
        self.$http.get('/scheduler/scheduler/' + self.id)
          .then(function (response) {
            let content = response.data.data.content
            self.form.name = content.name
            self.form.jobName = content.jobName
            self.form.jobClass = content.jobClass
            self.form.jobGroup = content.jobGroup
            self.form.triggerName = content.triggerName
            self.form.triggerGroup = content.triggerGroup
            self.form.triggerCronExpression = content.triggerCronExpression
            self.form.triggerCronExpressionDesc = content.triggerCronExpressionDesc
            self.form.description = content.description
            self.form.updateTime = content.updateAt
            self.formDataLoading = false
            return Promise.resolve(content)
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
              self.$http.put('/scheduler/scheduler/' + self.id, self.form)
                .then(function (response) {
                  self.$message.info('任务计划修改成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  if (response.response.status === 404) {
                    self.$message.error('任务计划改失败，数据不存在或已被他人修改，请刷新列表后再试')
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
    watch: {},
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
