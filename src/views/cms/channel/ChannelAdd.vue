<template>
  <div class="fh-page-wrapper">
    <el-form ref="form" class="fh-background-white fh-padding-30" :model="form" :rules="formRules" style="width: 460px;" label-width="100px">
      <el-form-item label="名称" prop="name">
        <el-input  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="路径" prop="path">
        <el-input v-model="form.path"></el-input>
      </el-form-item>
      <el-form-item label="模板" prop="template">
        <template-select v-model="form.template" type="channel" :site-id="form.siteId" :folder="false"></template-select>
      </el-form-item>
      <el-form-item label="栏目分类" prop="channelType">
        <self-dict-select v-model="form.channelType" type="cms_channel_type"></self-dict-select>
      </el-form-item>
      <el-form-item label="站点" prop="siteId">
        <SiteSelect ref="siteinput"  v-model="form.siteId">
        </SiteSelect>
      </el-form-item>
      <el-form-item label="显示顺序" prop="sequence">
        <el-input-number v-model="form.sequence" :min="0" :max="1000" controls-position="right"></el-input-number>
      </el-form-item>
      <el-form-item label="父级" prop="parentId">
        <ChannelInputSelect ref="channelinput" :site-id="form.siteId" v-model="form.parentId">
        </ChannelInputSelect>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-check" @click="addBtnClick" :loading="addLoading">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import ChannelInputSelect from '@/views/cms/channel/ChannelInputSelect.vue'
  import SiteSelect from '@/views/cms/site/SiteSelect.vue'
  import TemplateSelect from '@/views/cms/TemplateSelect'

  export default {
    components: {ChannelInputSelect, SelfDictSelect, SiteSelect, TemplateSelect},
    name: 'ChannelAdd',
    data () {
      return {
        form: {
          name: null,
          path: null,
          sequence: null,
          siteId: null,
          template: null,
          channelType: null,
          parentId: '0'
        },
        addLoading: false,
        formRules: {
          name: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          siteId: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          channelType: [
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
              self.$http.post('/cms/channel', self.form)
                .then(function (response) {
                  self.$message.success('栏目添加成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  self.$message.error('栏目添加失败，请稍后再试')
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
        this.$refs.channelinput.setLabelName(null)
      }
    },
    watch: {
    },
    beforeRouteEnter  (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        let dataControl = 'ChannelAddLoadData=true'
        if (vm.$utils.loadDataControl.has(dataControl)) {
          // 重置表单
          vm.resetForm()
          vm.$utils.loadDataControl.remove(dataControl)
        }

        if (vm.form.siteId !== vm.$route.query.siteId && vm.$route.query.siteId) {
          vm.form.siteId = vm.$route.query.siteId
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
