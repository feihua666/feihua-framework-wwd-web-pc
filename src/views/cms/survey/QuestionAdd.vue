<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" :rules="formRules" style="width: 500px;" label-width="100px">
      <el-form-item label="问题标题" prop="name" required>
        <el-input  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="问题类型" prop="type" required>
        <SelfDictSelect  v-model="form.type" type="question_type"></SelfDictSelect>
      </el-form-item>
      <el-form-item label="是否换行" prop="br" v-if="isBr">
        <SelfDictSelect  v-model="form.br" type="yes_no"></SelfDictSelect>
      </el-form-item>
      <el-form-item label="排序" prop="sequence">
        <el-input-number  :min="0" v-model="form.sequence" style="width: 100%;"></el-input-number>
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
    name: 'QuestionAdd',
    data () {
      return {
        isBr: false,
        form: {
          surveyId: null,
          name: null,
          type: null,
          br: 'N',
          sequence: 0
        },
        addLoading: false,
        formRules: {
          name: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '必填', trigger: 'change'}
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
              self.$http.post('/cms/question', self.form)
                .then(function (response) {
                  self.$message.info('调查添加成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  self.$message.error('调查添加失败，请稍后再试')
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
      'form.type' (val) {
        let self = this
        if (val === 'radio' || val === 'checkbox') {
          self.isBr = true
        } else {
          self.isBr = false
        }
      }
    },
    beforeRouteEnter  (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        let dataControl = 'QuestionAddLoadData=true'
        if (loadDataControl.has(vm.$store, dataControl)) {
          // 重置表单
          vm.resetForm()
          loadDataControl.remove(vm.$store, dataControl)
        }
        if (vm.form.surveyId !== vm.$route.params.surveyId) {
          vm.form.surveyId = vm.$route.params.surveyId
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
