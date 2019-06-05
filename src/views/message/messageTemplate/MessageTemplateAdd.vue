<template>
  <div class="fh-page-wrapper">
    <el-form ref="form" class="fh-background-white fh-padding-30" :model="form" :rules="formRules" style="width: 460px;" label-width="100px">
      <el-form-item label="模板名称" prop="name">
        <el-input  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="模板编码" prop="code">
        <el-input  v-model="form.code"></el-input>
      </el-form-item>
      <el-form-item label="模板内容" prop="content">
        <el-input :placeholder="'可指定参数,如：您好，{{userName}}先生，您此次摇号已中签'" autosize type="textarea" v-model="form.content"></el-input>
      </el-form-item>
      <el-form-item label="消息标题" prop="title">
        <el-input :placeholder="'可指定参数,如：尊敬的{{userName}}'"  v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="消息简介" prop="profile">
        <el-input :placeholder="'可指定参数,如：这是一条{{userName}}的简介'"  v-model="form.profile"></el-input>
      </el-form-item>
      <el-form-item label="消息分类" prop="msgType">
        <self-dict-select v-model="form.msgType" type="message_type"></self-dict-select>
        只对非虚拟客户端有效，如果绑定了三方模板，且三方支持则三方也有效
      </el-form-item>
      <el-form-item label="消息紧急性" prop="msgLevel">
        <self-dict-select v-model="form.msgLevel" type="message_level"></self-dict-select>
        只对非虚拟客户端有效，如果绑定了三方模板，且三方支持则三方也有效
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-check" @click="addBtnClick" :loading="addLoading">添加</el-button>
        <div>如果要发第三方的模板消息，请添加完成后再绑定三方消息模板</div>
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
    name: 'MessageTemplateAdd',
    data () {
      return {
        form: {
          name: null,
          code: null,
          content: null,
          title: null,
          profile: null,
          msgType: null,
          msgLevel: null
        },
        addLoading: false,
        formRules: {
          name: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          title: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          msgType: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          msgLevel: [
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
              self.$http.post('/base/message/template', self.form)
                .then(function (response) {
                  self.$message.success('消息模板添加成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  self.$message.error('消息模板添加失败，请稍后再试')
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
        let dataControl = 'MessageTemplateAddLoadData=true'
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
