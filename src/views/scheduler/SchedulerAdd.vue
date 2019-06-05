<template>
  <div class="fh-page-wrapper">
    <el-form ref="form" class="fh-background-white fh-padding-30" :model="form" :rules="formRules" style="width: 460px;" label-width="150px">
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
          <el-button type="primary" icon="el-icon-check" @click="addBtnClick" :loading="addLoading">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import OfficeInputSelect from '@/views/office/OfficeInputSelect'

  export default {
    components: {
      SelfDictSelect, OfficeInputSelect
    },
    name: 'SchedulerAdd',
    data () {
      return {
        form: {
          name: '',
          jobName: '',
          jobClass: '',
          jobGroup: '',
          triggerName: '',
          triggerGroup: '',
          triggerCronExpression: '',
          triggerCronExpressionDesc: '',
          description: ''
        },
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
      this.initParam()
    },
    methods: {
      initParam () {
        let uuid = this.$utils.guid()
        let jobName = 'jobName_' + uuid
        let jobGroup = 'jobGroup_' + uuid
        let triggerName = 'triggerName_' + uuid
        let triggerGroup = 'triggerGroup_' + uuid
        this.form.jobName = this.$route.query.jobName || jobName
        this.form.jobClass = this.$route.query.jobClass
        this.form.jobGroup = this.$route.query.jobGroup || jobGroup
        this.form.triggerName = this.$route.query.triggerName || triggerName
        this.form.triggerGroup = this.$route.query.triggerGroup || triggerGroup
        this.form.triggerCronExpression = this.$route.query.cron
        this.form.description = this.$route.query.description
      },
      addBtnClick () {
        let self = this
        if (self.addLoading === false) {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              // 请求添加
              self.addLoading = true
              self.$http.post('/scheduler/scheduler', self.form)
                .then(function (response) {
                  self.$message.info('任务计划添加成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  self.$message.error('任务计划添加失败，请稍后再试')
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
    computed: {},
    watch: {
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        let dataControl = 'SchedulerAddLoadData=true'
        if (vm.$utils.loadDataControl.has(dataControl)) {
          // 重置表单
          vm.resetForm()
          vm.initParam()
          vm.$utils.loadDataControl.remove(dataControl)
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
