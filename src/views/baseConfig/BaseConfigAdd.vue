<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" :rules="formRules" label-width="150px">
      <el-form-item label="是否启用配置" prop="status">
        <el-switch v-model="form.status"
                   active-value="Y"
                   inactive-value="N">
        </el-switch>
      </el-form-item>
      <el-form-item label="CONFIG_KEY" prop="configKey" required>
        <el-input v-model="form.configKey" autocomplete="off"
                  placeholder="key"></el-input>
      </el-form-item>
      <el-form-item label="CONFIG_VALUE" prop="configValue" required>
        <el-input type="textarea" :autosize="{ minRows: 10}" v-model="form.configValue"></el-input>
        <div>注意：如果配置内容为json,请严格按json双引号标准填写</div>
      </el-form-item>
      <el-form-item label="配置说明" prop="description">
        <el-input v-model="form.description" autocomplete="off"
                  placeholder="配置说明"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addBtnClick" :loading="addLoading">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'BaseConfigAdd',
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
    },
    methods: {
      addBtnClick () {
        let self = this
        if (self.addLoading === false) {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              // 请求添加
              self.addLoading = true
              self.$http.postJson('/base/config', self.form)
                .then(function (response) {
                  self.$message.success('系统配置添加成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  self.$message.error('系统配置添加失败，请稍后再试')
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
    beforeRouteEnter (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        let dataControl = 'BaseConfigAddAddLoadData=true'
        if (vm.$utils.loadDataControl.has(dataControl)) {
          // 重置表单
          vm.resetForm()
          vm.$utils.loadDataControl.remove(dataControl)
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
