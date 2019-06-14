<template>
  <div class="fh-page-wrapper">
    <el-form ref="form" class="fh-background-white fh-padding-30" :model="form" :rules="formRules" style="width: 460px;" label-width="100px" v-loading="formDataLoading">
          <el-form-item label="编码" prop="code">
            <el-input disabled  v-model="form.code"></el-input>
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
                <el-button type="primary" icon="el-icon-check" @click="updateBtnClick" :loading="addLoading">修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import SelfDictSelect from '@/components/SelfDictSelect.vue'
    export default {
      name: 'LoginClientEdit',
      components: {
        SelfDictSelect},
      data () {
        return {
          // 编辑的id
          id: null,
          form: {
            code: '',
            name: '',
            type: '',
            description: '',
            isVirtual: '',
            updateTime: null
          },
          formDataLoading: false,
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
        this.id = this.$route.params.id
        this.loadEditData(this.id)
      },
      methods: {
        loadEditData (id) {
          if (this.formDataLoading === true) {
            return
          }
          this.resetForm()
          let self = this
          self.formDataLoading = true
          self.$http.get('/base/client/loginclient/' + self.id)
            .then(function (response) {
              let content = response.data.data.content
              self.form.code = content.code
              self.form.name = content.name
              self.form.type = content.type
              self.form.description = content.description
              self.form.isVirtual = content.isVirtual
              self.form.updateTime = content.updateAt
              self.formDataLoading = false
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
                self.$http.put('/base/client/loginclient/' + self.id, self.form)
                  .then(function (response) {
                    self.$message.success('客户端修改成功')
                    self.addLoading = false
                  })
                  .catch(function (response) {
                    if (response.response.status === 404) {
                      self.$message.error('客户端改失败，数据不存在或已被他人修改，请刷新列表后再试')
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
          let dataControl = 'LoginClientEditLoadData=true'
          if (vm.id !== vm.$route.params.id || vm.$utils.loadDataControl.has(dataControl)) {
            vm.id = vm.$route.params.id
            vm.loadEditData(vm.id)
            vm.$utils.loadDataControl.remove(dataControl)
          }
        })
      }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
