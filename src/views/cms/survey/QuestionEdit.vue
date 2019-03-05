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
    name: 'QuestionEdit',
    data () {
      return {
        myDateRange: '',
        form: {
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
      this.id = this.$route.params.id
      this.loadEditData(this.id)
    },
    methods: {
      loadEditData (id) {
        let self = this
        self.resetForm()
        self.formDataLoading = true
        self.$http.get('/cms/question/' + self.id)
          .then(function (response) {
            let content = response.data.data.content
            self.form.surveyId = content.surveyId
            self.form.name = content.name
            self.form.type = content.type
            self.form.br = content.br
            self.form.sequence = content.sequence
            self.form.updateTime = content.updateAt
            self.formDataLoading = false
            self.myDateRange = [content.startTime, content.endTime]
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
              self.$http.put('/cms/question/' + self.id, self.form)
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
      'form.type' (val) {
        let self = this
        if (val === 'radio' || val === 'checkbox') {
          self.isBr = true
        } else {
          self.isBr = false
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
