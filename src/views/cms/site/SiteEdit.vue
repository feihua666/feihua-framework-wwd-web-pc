<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" :rules="formRules" style="width: 460px;" label-width="100px" v-loading="formDataLoading">
      <el-form-item label="名称" prop="name" required>
        <el-input  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="域名" prop="domain">
        <el-input  v-model="form.domain" placeholder="http://localhost:8080"></el-input>
      </el-form-item>
      <el-form-item label="访问路径" prop="path">
        <el-input  v-model="form.path" placeholder="站点访问径 如：/demo"></el-input>
      </el-form-item>
      <el-form-item label="模板路径" prop="templatePath">
<!--
        <el-input  v-model="form.templatePath" placeholder="不填写使用默认模板 如：/demo"></el-input>
-->
        <template-select v-model="form.templatePath" type="site" :folder="true" placeholder="不填写使用默认模板 如：/demo"></template-select>
      </el-form-item>
      <el-form-item label="模板" prop="template">
        <!--<el-input  v-model="form.template" placeholder="请填写模板路径下的文件名 如：index.html"></el-input>-->
        <template-select v-model="form.template" type="site" :template-path="form.templatePath" :folder="false" placeholder="请填写模板路径下的文件名 如：index.html"></template-select>
      </el-form-item>
      <el-form-item label="静态页路径" prop="staticPath">
        <el-input  v-model="form.staticPath" placeholder="静态页存放目录,如：/demohtml"></el-input>
      </el-form-item>
      <el-form-item label="部署路径" prop="deployPath">
        <el-input  v-model="form.deployPath" placeholder="如果是根路径请留空 如：/demo"></el-input>
      </el-form-item>
      <el-form-item label="是否主站" prop="isMain">
        <SelfDictSelect  v-model="form.isMain" type="yes_no"></SelfDictSelect>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateBtnClick" :loading="addLoading">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import TemplateSelect from '@/views/cms/TemplateSelect'
  export default {
    name: 'SiteEdit',
    components: {
      TemplateSelect,
      SelfDictSelect
    },
    data () {
      let validateDomain = (rule, value, callback) => {
        if ((value === '' || value == null) && (this.form.path === '' || this.form.path == null)) {
          callback(new Error('访问路径和域名至少填写一项'))
        } else {
          callback()
        }
      }
      let validatePath = (rule, value, callback) => {
        if ((value === '' || value == null) && (this.form.domain === '' || this.form.domain == null)) {
          callback(new Error('访问路径和域名至少填写一项'))
        } else {
          callback()
        }
      }
      return {
        // 编辑的id
        id: null,
        form: {
          name: null,
          domain: null,
          path: null,
          templatePath: null,
          template: null,
          staticPath: null,
          deployPath: null,
          isMain: null,
          updateTime: null
        },
        formDataLoading: false,
        addLoading: false,
        formRules: {
          name: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          domain: [
            {validator: validateDomain, trigger: 'blur'}
          ],
          path: [
            {validator: validatePath, trigger: 'blur'}
          ],
          staticPath: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          isMain: [
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
        self.$http.get('/cms/site/' + self.id)
          .then(function (response) {
            let content = response.data.data.content
            self.form.name = content.name
            self.form.domain = content.domain
            self.form.path = content.path
            self.form.templatePath = content.templatePath
            self.form.template = content.template
            self.form.staticPath = content.staticPath
            self.form.deployPath = content.deployPath
            self.form.isMain = content.isMain
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
              self.$http.put('/cms/site/' + self.id, self.form)
                .then(function (response) {
                  self.$message.info('站点修改成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  if (response.response.status === 404) {
                    self.$message.error('站点修改失败，数据不存在或已被他人修改，请刷新列表后再试')
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
