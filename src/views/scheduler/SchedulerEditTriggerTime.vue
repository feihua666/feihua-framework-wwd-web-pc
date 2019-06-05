<template>
  <div class="fh-page-wrapper">
    <el-form ref="form" class="fh-background-white fh-padding-30" :model="form" :rules="formRules" style="width: 460px;" label-width="100px"
               v-loading="formDataLoading">
        <el-form-item label="任务名称" prop="name">
          <el-input  :disabled="true"  v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="任务名称英文" prop="jobName">
          <el-input  :disabled="true"  v-model="form.jobName"></el-input>
        </el-form-item>
        <el-form-item label="任务class" prop="jobClass">
          <el-input :disabled="true"  v-model="form.jobClass"></el-input>
        </el-form-item>
        <el-form-item label="任务组" prop="jobGroup">
          <el-input  :disabled="true" v-model="form.jobGroup"></el-input>
        </el-form-item>
        <el-form-item label="触发器名称英文" prop="triggerName">
          <el-input :disabled="true"  v-model="form.triggerName"></el-input>
        </el-form-item>
        <el-form-item label="触发器组" prop="triggerGroup">
          <el-input :disabled="true"  v-model="form.triggerGroup"></el-input>
        </el-form-item>
        <el-form-item label="cron表达式" prop="triggerCronExpression">
          <el-input  v-model="form.triggerCronExpression"></el-input>
        </el-form-item>
        <el-form-item label="cron表达式描述" prop="triggerCronExpressionDesc">
          <el-input  v-model="form.triggerCronExpressionDesc"></el-input>
        </el-form-item>
        <el-form-item label="立即执行" prop="startNow">
          <el-checkbox v-model="startNow">立即执行</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-check" @click="updateBtnClick" :loading="addLoading">确认修改</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import OfficeInputSelect from '@/views/office/OfficeInputSelect'

  export default {
    name: 'SchedulerEditTriggerTime',
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
        oldCron: '',
        formDataLoading: false,
        addLoading: false,
        formRules: {
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
            self.oldCron = content.triggerCronExpression
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
              if (self.oldCron === self.form.triggerCronExpression) {
                self.$message.info('cron表达式没有变化，请输入cron表达式')
                return false
              }
              // 请求添加
              self.addLoading = true
              let form = {
                cron: self.form.triggerCronExpression,
                cronDesc: self.form.triggerCronExpressionDesc,
                startNow: self.form.startNow
              }
              self.$http.post('/scheduler/scheduler/' + self.id + '/modifyTriggerTime', form)
                .then(function (response) {
                  self.$message.info('任务计划时间修改成功')
                  self.oldCron = self.form.triggerCronExpression
                  self.addLoading = false
                })
                .catch(function (response) {
                  if (response.response.status === 404) {
                    self.$message.error('任务计划改失败，数据不存在，请刷新列表后再试')
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

</style>
