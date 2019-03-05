<template>
  <div class="wrapper">

    <el-form ref="form" :model="form" :rules="formRules" style="width: 460px;" label-width="100px">
      <el-form-item label="名称" prop="name">
        <el-input  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description"></el-input>
      </el-form-item>

      <el-form-item label="站点" prop="siteId">
        <SiteSelect ref="siteinput"  v-model="form.siteId">
        </SiteSelect>
      </el-form-item>
      <el-form-item label="栏目" prop="channelId">
        <ChannelInputSelect ref="channelinput" :site-id="form.siteId"  v-model="form.channelId">
        </ChannelInputSelect>
      </el-form-item>
      <el-form-item label="显示顺序" prop="sequence">
        <el-input-number v-model="form.sequence" :min="0" :max="1000" controls-position="right"></el-input-number>
      </el-form-item>
      <el-form-item label="父级" prop="parentId">
        <ContentCategoryInputSelect ref="refsParentInput" :site-id="form.siteId" v-model="form.parentId">
        </ContentCategoryInputSelect>
      </el-form-item>
      <el-form-item label="更多内容">
        <el-switch
          v-model="enableAdvance"
          active-text="点击展开">
        </el-switch>
      </el-form-item>

      <el-form-item label="图片地址" prop="imageUrl" v-if="enableAdvance">
        <el-button size="mini" icon="el-icon-upload2" @click="uploadBtnClick">上传图片</el-button>
        <img v-if="form.imageUrl" :src="$config.file.getDownloadUrl(form.imageUrl)"/>
      </el-form-item>
      <el-form-item label="图片描述" prop="imageDes" v-if="enableAdvance">
        <el-input  v-model="form.imageDes"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addBtnClick" :loading="addLoading">添加</el-button>
      </el-form-item>
    </el-form>

    <file-upload ref="fileupload" :on-success="uploadSuccess" :data="{path: 'cmsContentCategory'}" accept="image/gif, image/jpeg, image/png" :limit="1" title="图片上传"></file-upload>

  </div>
</template>

<script>
  import loadDataControl from '@/utils/storeLoadDataControlUtils.js'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import ContentCategoryInputSelect from '@/views/cms/content/category/ContentCategoryInputSelect.vue'
  import SiteSelect from '@/views/cms/site/SiteSelect.vue'
  import FileUpload from '@/components/FileUpload.vue'
  import ChannelInputSelect from '@/views/cms/channel/ChannelInputSelect.vue'

  export default {
    components: {ContentCategoryInputSelect, SelfDictSelect, SiteSelect, FileUpload, ChannelInputSelect},
    name: 'ContentCategoryAdd',
    data () {
      return {
        form: {
          name: null,
          sequence: 0,
          siteId: null,
          channelId: null,
          description: null,
          parentId: '0',
          imageUrl: null,
          imageDes: null
        },
        enableAdvance: false,
        addLoading: false,
        formRules: {
          name: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          siteId: [
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
              self.$http.post('/cms/content/category', self.form)
                .then(function (response) {
                  self.$message.info('内容分类添加成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  self.$message.error('内容分类添加失败，请稍后再试')
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
        this.$refs.refsParentInput.setLabelName(null)
      },
      uploadBtnClick () {
        this.$refs.fileupload.show()
      },
      uploadSuccess (res, file, fileList) {
        let content = res.data.content
        this.form.imageUrl = content.path
      }
    },
    watch: {
    },
    beforeRouteEnter  (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        let dataControl = 'ContentCategoryAddLoadData=true'
        if (loadDataControl.has(vm.$store, dataControl)) {
          // 重置表单
          vm.resetForm()
          loadDataControl.remove(vm.$store, dataControl)
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
.wrapper{
  padding:1.5rem;
  overflow: auto;
  height: 100%;
}
</style>
