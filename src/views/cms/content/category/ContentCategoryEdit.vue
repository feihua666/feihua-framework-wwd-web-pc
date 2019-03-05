<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" :rules="formRules" style="width: 460px;" label-width="100px" v-loading="formDataLoading">
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
        <el-button type="primary" @click="updateBtnClick" :loading="addLoading">修改</el-button>
      </el-form-item>
    </el-form>

    <file-upload ref="fileupload" :on-success="uploadSuccess" :data="{path: 'cmsContentCategory'}" accept="image/gif, image/jpeg, image/png" :limit="1" title="图片上传"></file-upload>

  </div>
</template>

<script>
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import ContentCategoryInputSelect from '@/views/cms/content/category/ContentCategoryInputSelect.vue'
  import SiteSelect from '@/views/cms/site/SiteSelect.vue'
  import FileUpload from '@/components/FileUpload.vue'
  import ChannelInputSelect from '@/views/cms/channel/ChannelInputSelect.vue'

  export default {
    name: 'ContentCategoryEdit',
    components: {ContentCategoryInputSelect, SelfDictSelect, SiteSelect, FileUpload, ChannelInputSelect},
    data () {
      return {
        // 编辑的id
        id: null,
        form: {
          name: null,
          sequence: 0,
          siteId: null,
          channelId: null,
          description: null,
          parentId: '0',
          imageUrl: null,
          imageDes: null,
          updateTime: null
        },
        formDataLoading: false,
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
      this.id = this.$route.params.id
      this.loadEditData(this.id)
    },
    methods: {
      loadEditData (id) {
        this.resetForm()
        let self = this
        self.formDataLoading = true
        self.$http.get('/cms/content/category/' + self.id)
          .then(function (response) {
            let content = response.data.data.content
            self.form.name = content.name
            self.form.description = content.description
            self.form.sequence = content.sequence
            self.form.parentId = content.parentId
            self.form.siteId = content.siteId
            self.form.channelId = content.channelId
            self.form.imageUrl = content.imageUrl
            self.form.imageDes = content.imageDes
            self.form.updateTime = content.updateAt
            self.formDataLoading = false
            return Promise.resolve({parentId: content.parentId, channelId: content.channelId})
          }).then(p => {
            // 回显父级,栏目
            self.$refs.refsParentInput.initLabelName(p.parentId)
            self.$refs.channelinput.initLabelName(p.channelId)
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
              self.$http.put('/cms/content/category/' + self.id, self.form)
                .then(function (response) {
                  self.$message.info('内容分类修改成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  if (response.response.status === 404) {
                    self.$message.error('内容分类修改失败，数据不存在或已被他人修改，请刷新列表后再试')
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
    overflow: auto;
    height: 100%;
  }
</style>
