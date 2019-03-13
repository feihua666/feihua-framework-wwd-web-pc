<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" :rules="formRules" v-loading="addLoading" label-width="150px">
      <el-form-item label="是否启用配置" prop="status" >
        <el-switch v-model="form.status"
                   active-value="Y"
                   inactive-value="N">
        </el-switch>
      </el-form-item>
      <el-form-item label="CONFIG_KEY" prop="configKey" required>
        <el-input v-model="form.configKey" autocomplete="off"
                  placeholder="key" readonly></el-input>
      </el-form-item>
      <el-form-item label="CONFIG_VALUE" prop="configValue" required>
        <el-input type="textarea" :autosize="{ minRows: 10}" v-model="form.configValue"></el-input>
      </el-form-item>
      <el-form-item label="配置说明" prop="description">
        <el-input v-model="form.description" autocomplete="off"
                  placeholder="配置说明"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateBtnClick" :loading="addLoading">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'BaseConfigEdit',
    data () {
      return {
        form: {
          status: 'Y',
          description: null,
          configKey: null,
          configValue: null
        },
        addLoading: false,
        formRules: {
          configKey: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          configValue: [
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
        self.$http.get('/base/config/' + self.id)
          .then(function (response) {
            let content = response.data.data.content
            self.form = content
            self.form.updateTime = content.updateAt
            self.formDataLoading = false
            return Promise.resolve(content)
          }).catch(function (response) {
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
              self.form.id = self.id
              self.$http.put('/base/config/' + self.form.id, self.form, {'dataType': 'json'})
                .then(function (response) {
                  self.$message.info('系统配置修改成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  if (response.response.status === 404) {
                    self.$message.error('系统配置修改失败，数据不存在或已被他人修改，请刷新列表后再试')
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
    // tab切换如果参数不一样，重新加载数据
    beforeRouteEnter (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        if (vm.id !== vm.$route.params.id) {
          vm.id = vm.$route.params.id
          vm.loadEditData(vm.id)
        }
      })
    },
    watch: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .wrapper {
    padding: 1.5rem;
    overflow: auto;
    height: 100%;
  }
</style>
