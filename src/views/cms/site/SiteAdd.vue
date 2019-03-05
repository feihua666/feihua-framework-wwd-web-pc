<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" :rules="formRules" style="width: 460px;" label-width="100px">
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
        <template-select v-model="form.templatePath" type="site" :folder="true" placeholder="不填写使用默认模板 如：/demo"></template-select>
      </el-form-item>
      <el-form-item label="模板" prop="template">
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
        <el-button type="primary" @click="addBtnClick" :loading="addLoading">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import loadDataControl from '@/utils/storeLoadDataControlUtils.js'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import TemplateSelect from '@/views/cms/TemplateSelect'
  export default {
    components: {
      SelfDictSelect,
      TemplateSelect
    },
    name: 'SiteAdd',
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
        form: {
          name: null,
          domain: null,
          path: null,
          templatePath: null,
          template: null,
          staticPath: null,
          deployPath: null,
          isMain: null
        },
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
    },
    methods: {
      addBtnClick () {
        let self = this
        if (self.addLoading === false) {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              // 请求添加
              self.addLoading = true
              self.$http.post('/cms/site', self.form)
                .then(function (response) {
                  self.$message.info('站点添加成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  self.$message.error('站点添加失败，请稍后再试')
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
        let dataControl = 'SiteAddLoadData=true'
        if (loadDataControl.has(vm.$store, dataControl)) {
          // 重置表单
          vm.resetForm()
          loadDataControl.remove(vm.$store, dataControl)
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
