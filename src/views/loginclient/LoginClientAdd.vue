<template>

  <div class="fh-page-wrapper">
    <el-form ref="form" class="fh-background-white fh-padding-30" :model="form" :rules="formRules" style="width: 460px;" label-width="100px">

      <el-form-item label="编码" prop="code">
        <el-input  v-model="form.code"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <self-dict-select v-model="form.type" type="login_client" ></self-dict-select>
      </el-form-item>
      <el-form-item label="是否虚拟客户端" prop="isVirtual">
        <self-dict-select v-model="form.isVirtual" type="yes_no" ></self-dict-select>
      </el-form-item>
      <el-form-item label="描述" prop="description">
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
    export default {
      components: {
        SelfDictSelect },
      name: 'LoginClientAdd',
      data () {
        return {
          form: {
            code: '',
            name: '',
            type: '',
            isVirtual: '',
            description: ''
          },
          addLoading: false,
          formRules: {
            code: [
              {required: true, message: '必填', trigger: 'blur'}
            ],
            name: [
              {required: true, message: '必填', trigger: 'blur'}
            ],
            isVirtual: [
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
                self.$http.post('/base/client/loginclient', self.form)
                  .then(function (response) {
                    self.$message.success('客户端添加成功')
                    self.addLoading = false
                  })
                  .catch(function (response) {
                    self.$message.error('客户端添加失败，请稍后再试')
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
          let dataControl = 'LoginClientAddLoadData=true'
          if (vm.$utils.loadDataControl.has(dataControl)) {
            // 重置表单
            vm.resetForm()
            vm.$utils.loadDataControl.remove(dataControl)
          }
        })
      }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
