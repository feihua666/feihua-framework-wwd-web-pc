<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" :rules="formRules" label-width="150px">
      <el-form-item label="标题" prop="title" required>
        <el-input  v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="作者" prop="author" required>
        <el-input  v-model="form.author" placeholder="作者"></el-input>
      </el-form-item>
      <el-form-item label="来源" prop="original">
        <el-input  v-model="form.original" placeholder="来源"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <SelfDictSelect  v-model="form.status" type="cms_content_status"></SelfDictSelect>
      </el-form-item>
      <el-form-item label="发布时间" prop="publishAt">
        <el-date-picker v-model="form.publishAt" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="日期时间"> </el-date-picker>
      </el-form-item>
      <el-form-item label="内容类型" prop="contentType">
        <SelfDictSelect  v-model="form.contentType" type="cms_content_type"></SelfDictSelect>
      </el-form-item>
      <el-form-item label="关联分类">
        <content-category-checkbox-group v-model="form.categoryIds" :site-id="form.siteId"></content-category-checkbox-group>
      </el-form-item>
      <el-form-item label="模板" prop="template">
        <template-select v-model="form.template" type="content" :site-id="form.siteId" :folder="false"></template-select>
      </el-form-item>
      <el-form-item label="站点" prop="siteId">
        <SiteSelect ref="siteinput"  v-model="form.siteId">
        </SiteSelect>
      </el-form-item>
      <el-form-item label="栏目" prop="channelId">
        <ChannelInputSelect ref="channelinput" :site-id="form.siteId"  v-model="form.channelId">
        </ChannelInputSelect>
      </el-form-item>
      <el-form-item label="内容简介" prop="profile">
        <el-input  v-model="form.profile" placeholder="内容简介"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content" >
        <TinymceEditor ref="tinymceeditor" v-model="form.content"></TinymceEditor>
      </el-form-item>
      
      <el-form-item label="封面图片">
        <el-switch
          v-model="enableCoverImage"
          active-text="点击展开">
        </el-switch>
      </el-form-item>

      <template  v-if="enableCoverImage">
      <el-form-item label="图片地址" prop="imageUrl" :rules="{required: true, message: '必填', trigger: 'blur'}">
        <el-input  v-model="form.imageUrl" clearable>
          <el-button size="mini" slot="prepend" icon="el-icon-upload2" @click="uploadCoverImageBtnClick">上传图片</el-button>
        </el-input>
        <br/>
        <img class="my-image-preview" v-if="form.imageUrl" :src="$config.file.getDownloadUrl(form.imageUrl)"/>
      </el-form-item>
      <el-form-item label="图片描述" prop="imageDes">
        <el-input  v-model="form.imageDes"></el-input>
      </el-form-item>
      </template>
      <el-form-item label="附件" v-if="form.contentType == 'article'">
        <el-switch
          v-model="enableAttachment"
          active-text="点击展开">
        </el-switch>
      </el-form-item>

      <template v-if="enableAttachment && form.contentType == 'article'">
      <template v-for="(attachment, index) in form.attachments">


        <!--<el-form-item :label="'附件类型' + index" :prop="'attachments.' + index + '.type'" :rules="{required: true, message: '必填', trigger: 'blur'}">
          <SelfDictSelect  v-model="attachment.type" type="file_type"></SelfDictSelect>
        </el-form-item>-->

      <el-form-item :label="'附件url' + index" :prop="'attachments.' + index + '.url'" :rules="{required: true, message: '必填', trigger: 'blur'}" >

        <el-input  v-model="attachment.url" clearable>
          <el-button slot="prepend" icon="el-icon-upload2" @click="uploadAttachBtnClick(index)">上传</el-button>
        </el-input>

      </el-form-item>
      <el-form-item :label="'附件描述' + index" :prop="'attachments.' + index + '.description'">
        <el-input  v-model="attachment.description"></el-input>
      </el-form-item>

        <el-form-item :label="'附件图片地址' + index" :prop="'attachments.' + index + '.imageUrl'">
          <el-input  v-model="attachment.imageUrl" clearable>
            <el-button size="mini" slot="prepend" icon="el-icon-upload2" @click="uploadAttachImageBtnClick(index)">上传图片</el-button>
          </el-input>
          <br/>
          <img class="my-image-preview" v-if="attachment.imageUrl" :src="$config.file.getDownloadUrl(attachment.imageUrl)"/>
        </el-form-item>
        <el-form-item :label="'附件图片描述' + index" :prop="'attachments.' + index + '.imageDes'">
          <el-input  v-model="attachment.imageDes"></el-input>
        </el-form-item>
        <el-form-item  v-if="index > 0">
          <el-button size="mini"  icon="el-icon-delete" @click="removeAttachBtnClick(index)">删除附件</el-button>
        </el-form-item>

      </template>
      <el-form-item>
        <el-button size="mini" icon="el-icon-plus" type="primary" @click="addAttachmentForm">添加附件</el-button>
      </el-form-item>
      </template>

      <template v-if="form.contentType == 'download'">

        <el-form-item label="下载url" prop="download.url" :rules="{required: true, message: '必填', trigger: 'blur'}">

          <el-input  v-model="form.download.url" clearable>
            <el-button slot="prepend" icon="el-icon-upload2" @click="uploadDownloadBtnClick">上传</el-button>
          </el-input>

        </el-form-item>
        <el-form-item label="下载描述" prop="download.description">
          <el-input  v-model="form.download.description"></el-input>
        </el-form-item>

        <el-form-item label="下载图片地址" prop="download.imageUrl" >
          <el-input  v-model="form.download.imageUrl" clearable>
            <el-button size="mini" slot="prepend" icon="el-icon-upload2" @click="uploadDownloadImageBtnClick">上传图片</el-button>
          </el-input>
          <br/>
          <img class="my-image-preview" v-if="form.download.imageUrl" :src="$config.file.getDownloadUrl(form.download.imageUrl)"/>
        </el-form-item>
        <el-form-item label="下载图片描述" prop="download.imageDes">
          <el-input  v-model="form.download.imageDes"></el-input>
        </el-form-item>
        <el-form-item label="系统平台" prop="download.os">
          <el-input  v-model="form.download.os"></el-input>
        </el-form-item>
        <el-form-item label="官网名称" prop="download.officialName">
          <el-input  v-model="form.download.officialName"></el-input>
        </el-form-item>
        <el-form-item label="官网地址" prop="download.officialUrl">
          <el-input  v-model="form.download.officialUrl"></el-input>
        </el-form-item>
        <el-form-item label="更新时间" prop="download.updateTime">
          <el-date-picker v-model="form.download.updateTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="日期时间"> </el-date-picker>
        </el-form-item>
        <el-form-item label="语言" prop="download.language">
          <el-input  v-model="form.download.language"></el-input>
        </el-form-item>

        <template  v-for="(downloadImage, index) in form.downloadImages">
          <el-form-item :label="'截图图片地址' + index" :prop="'downloadImages.' + index + '.imageUrl'"  :rules="{required: true, message: '必填', trigger: 'blur'}" >
            <el-input  v-model="downloadImage.imageUrl" clearable>
              <el-button slot="prepend" icon="el-icon-upload2" @click="uploadGalleryBtnClick(index)">上传</el-button>
            </el-input>
            <br/>
            <img class="my-image-preview" v-if="downloadImage.imageUrl" :src="$config.file.getDownloadUrl(downloadImage.imageUrl)"/>
          </el-form-item>
          <el-form-item :label="'截图缩略图地址' + index" :prop="'downloadImages.' + index + '.imageThumbnailUrl'">
            <el-input  v-model="downloadImage.imageThumbnailUrl"></el-input>
          </el-form-item>
          <el-form-item :label="'截图图片描述' + index" :prop="'downloadImages.' + index + '.imageDes'">
            <el-input  v-model="downloadImage.imageDes"></el-input>
          </el-form-item>
          <el-form-item  v-if="index >= 0">
            <el-button size="mini" icon="el-icon-delete" @click="removeDownloadImageBtnClick(index)">删除截图</el-button>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button size="mini" icon="el-icon-plus" type="primary" @click="addDownloadImageForm">添加截图</el-button>
        </el-form-item>
      </template>

      <template  v-if="form.contentType == 'gallery'">
        <template  v-for="(gallery, index) in form.gallerys">
          <el-form-item :label="'图库图片地址' + index" :prop="'gallerys.' + index + '.imageUrl'"  :rules="{required: true, message: '必填', trigger: 'blur'}" >
            <el-input  v-model="gallery.imageUrl" clearable>
              <el-button slot="prepend" icon="el-icon-upload2" @click="uploadGalleryBtnClick(index)">上传</el-button>
            </el-input>
            <br/>
            <img class="my-image-preview" v-if="gallery.imageUrl" :src="$config.file.getDownloadUrl(gallery.imageUrl)"/>
          </el-form-item>
          <el-form-item :label="'图库缩略图地址' + index" :prop="'gallerys.' + index + '.imageThumbnailUrl'">
            <el-input  v-model="gallery.imageThumbnailUrl"></el-input>
          </el-form-item>
          <el-form-item :label="'图库图片描述' + index" :prop="'gallerys.' + index + '.imageDes'">
            <el-input  v-model="gallery.imageDes"></el-input>
          </el-form-item>
          <el-form-item  v-if="index >= 0">
            <el-button size="mini" icon="el-icon-delete" @click="removeGalleryBtnClick(index)">删除图片</el-button>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button size="mini" icon="el-icon-plus" type="primary" @click="addGallerysForm">添加图片</el-button>
        </el-form-item>
      </template>

      <template v-if="form.contentType == 'library'">

        <el-form-item label="文库url" prop="library.url" :rules="{required: true, message: '必填', trigger: 'blur'}">

          <el-input  v-model="form.library.url" clearable>
            <el-button slot="prepend" icon="el-icon-upload2" @click="uploadLibraryBtnClick">上传</el-button>
          </el-input>

        </el-form-item>
        <el-form-item label="文库描述" prop="library.description">
          <el-input  v-model="form.library.description"></el-input>
        </el-form-item>

        <el-form-item label="文库图片地址" prop="library.imageUrl" >
          <el-input  v-model="form.library.imageUrl" clearable>
            <el-button size="mini" slot="prepend" icon="el-icon-upload2" @click="uploadLibraryImageBtnClick">上传图片</el-button>
          </el-input>
          <br/>
          <img class="my-image-preview" v-if="form.library.imageUrl" :src="$config.file.getDownloadUrl(form.library.imageUrl)"/>
        </el-form-item>
        <el-form-item label="文库图片描述" prop="library.imageDes">
          <el-input  v-model="form.library.imageDes"></el-input>
        </el-form-item>
        <el-form-item label="文库内容预览">
          <el-carousel type="card"  width="500px">
            <el-carousel-item v-for="item in form.libraryImages" :key="item">
              <img style="width:auto;height:300px;border: 1px solid gainsboro;" :src="$config.file.getDownloadUrl(item.imageUrl)">
            </el-carousel-item>
          </el-carousel>
        </el-form-item>
      </template>
      <template v-if="form.contentType == 'audio'">
        <el-form-item label="音频url" prop="audio.url" :rules="{required: true, message: '必填', trigger: 'blur'}">

          <el-input  v-model="form.audio.url" clearable>
            <el-button slot="prepend" icon="el-icon-upload2" @click="uploadAudioBtnClick">上传</el-button>
          </el-input>

        </el-form-item>
        <el-form-item label="音频描述" prop="audio.description">
          <el-input  v-model="form.audio.description"></el-input>
        </el-form-item>

        <el-form-item label="音频图片地址" prop="audio.imageUrl" >
          <el-input  v-model="form.audio.imageUrl" clearable>
            <el-button size="mini" slot="prepend"  icon="el-icon-upload2" @click="uploadAudioImageBtnClick">上传图片</el-button>
          </el-input>
          <br/>
          <img class="my-image-preview" v-if="form.audio.imageUrl" :src="$config.file.getDownloadUrl(form.audio.imageUrl)"/>
        </el-form-item>
        <el-form-item label="音频图片描述" prop="audio.imageDes">
          <el-input  v-model="form.audio.imageDes"></el-input>
        </el-form-item>
        <el-form-item label="音频时长" prop="audio.imageDes">
          <el-input  v-model="form.audio.duration"></el-input>
        </el-form-item>
        <el-form-item label="音频播放器" prop="audio.player" :rules="{required: true, message: '必填', trigger: 'blur'}">
          <SelfDictSelect  v-model="form.audio.player" type="cms_audio_player"></SelfDictSelect>
        </el-form-item>
        <el-form-item label="音频导演、演唱" prop="audio.director">
          <el-input  v-model="form.audio.director"></el-input>
        </el-form-item>
        <el-form-item label="音频演唱" prop="audio.performer">
          <el-input  v-model="form.audio.performer"></el-input>
        </el-form-item>
        <el-form-item label="音频语言" prop="audio.language">
          <el-input  v-model="form.audio.language"></el-input>
        </el-form-item>
        <el-form-item label="音频字幕" prop="audio.lrc">
          <el-input  v-model="form.audio.lrc"></el-input>
        </el-form-item>
        <el-form-item label="专辑" prop="audio.album">
          <el-input  v-model="form.audio.album"></el-input>
        </el-form-item>
        <el-form-item label="国家/地区" prop="audio.region">
          <el-input  v-model="form.audio.region"></el-input>
        </el-form-item>
        <el-form-item label="年代" prop="audio.years">
          <el-date-picker
            v-model="form.audio.years"
            type="year"
            value-format="yyyy"
            placeholder="选择年代">
          </el-date-picker>
        </el-form-item>
      </template>
      <template v-if="form.contentType == 'video'">
        <el-form-item label="视频url" prop="video.url" :rules="{required: (videoOtherPlayerHasValue() == false), message: '必填或填写一个第三方播放', trigger: 'blur'}">

          <el-input  v-model="form.video.url" clearable>
            <el-button slot="prepend" icon="el-icon-upload2" @click="uploadVideoBtnClick">上传</el-button>
          </el-input>

        </el-form-item>
        <el-form-item label="视频描述" prop="video.description">
          <el-input  v-model="form.video.description"></el-input>
        </el-form-item>

        <el-form-item label="视频图片地址" prop="video.imageUrl" >
          <el-input  v-model="form.video.imageUrl" clearable>
            <el-button size="mini" slot="prepend"  icon="el-icon-upload2" @click="uploadVideoImageBtnClick">上传图片</el-button>
          </el-input>
          <br/>
          <img class="my-image-preview" v-if="form.video.imageUrl" :src="$config.file.getDownloadUrl(form.video.imageUrl)"/>
        </el-form-item>
        <el-form-item label="视频图片描述" prop="video.imageDes">
          <el-input  v-model="form.video.imageDes"></el-input>
        </el-form-item>
        <el-form-item label="视频时长" prop="video.imageDes">
          <el-input  v-model="form.video.duration"></el-input>
        </el-form-item>
        <el-form-item label="视频播放器" prop="video.player" :rules="{required: (videoOtherPlayerHasValue() == false), message: '必填或填写一个第三方播放', trigger: 'blur'}">
          <SelfDictSelect  v-model="form.video.player" type="cms_video_player"></SelfDictSelect>
        </el-form-item>
        <el-form-item label="第三方播放">
          <el-switch
            v-model="enableVideoOtherPlayer"
            active-text="点击展开">
          </el-switch>
        </el-form-item>
        <template v-if="enableVideoOtherPlayer">
          <template  v-for="(item,index) in form.videoOtherPlayer">

            <el-form-item :label="'三方播放名称' + index" :prop="'videoOtherPlayer.' + index + '.player'">
              <el-input  v-model="item.player">
              </el-input>
            </el-form-item>
            <el-form-item :label="'三方播放地址' + index" :prop="'videoOtherPlayer.' + index + '.url'" >
              <el-input  v-model="item.url">
              </el-input>
            </el-form-item>
            <el-form-item  v-if="index >= 0">
              <el-button size="mini" icon="el-icon-delete" @click="removeVideoOtherPlayerBtnClick(index)">删除{{item.player}}</el-button>
            </el-form-item>
          </template>
          <el-form-item>
            <el-button size="mini" icon="el-icon-plus" type="primary" @click="addVideoOtherPlayerForm">添加三方播放</el-button>
          </el-form-item>
        </template>
        <el-form-item label="视频导演" prop="video.director">
          <el-input  v-model="form.video.director"></el-input>
        </el-form-item>
        <el-form-item label="视频主演" prop="video.performer">
          <el-input  v-model="form.video.performer"></el-input>
        </el-form-item>
        <el-form-item label="视频语言" prop="video.language">
          <el-input  v-model="form.video.language"></el-input>
        </el-form-item>
        <el-form-item label="国家/地区" prop="video.region">
          <el-input  v-model="form.video.region"></el-input>
        </el-form-item>
        <el-form-item label="总季数" prop="video.seasonCount">
          <el-input-number v-model="form.video.seasonCount" :min="1" :max="1000" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="当前第几季" prop="video.season">
          <el-input-number v-model="form.video.season" :min="1" :max="1000" controls-position="right"></el-input-number>

        </el-form-item>
        <el-form-item label="总集数" prop="video.spisodeCount">
          <el-input-number v-model="form.video.spisodeCount" :min="1" :max="1000" controls-position="right"></el-input-number>

        </el-form-item>
        <el-form-item label="当前第几集" prop="video.spisode">
          <el-input-number v-model="form.video.spisode" :min="1" :max="1000" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="年代" prop="video.years">
          <el-date-picker
            v-model="form.video.years"
            type="year"
            value-format="yyyy"
            placeholder="选择年代">
          </el-date-picker>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" @click="addBtnClick" :loading="addLoading">添加</el-button>
        <el-button type="primary" @click="addWebSpiderClick">抓取一个网页</el-button>
      </el-form-item>
    </el-form>
    <file-upload ref="coverImageUpload" :on-success="coverImageUploadSuccess" :data="{path: 'cmsContent'}" accept="image/gif, image/jpeg, image/png" :limit="1" title="封面图片"></file-upload>
    <file-upload ref="commonUpload"></file-upload>

    <single-web-spider ref="webSpider" :selector="{'title':'sss','content': 'ccc'}" :success="spiderSuccess"></single-web-spider>
  </div>
</template>

<script>
  import loadDataControl from '@/utils/storeLoadDataControlUtils.js'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import SiteSelect from '@/views/cms/site/SiteSelect.vue'
  import ChannelInputSelect from '@/views/cms/channel/ChannelInputSelect.vue'
  import TinymceEditor from '@/components/tinymceEditor/TinymceEditor.vue'
  import TemplateSelect from '@/views/cms/TemplateSelect'
  import FileUpload from '@/components/FileUpload.vue'
  import ContentCategoryCheckboxGroup from '@/views/cms/content/category/ContentCategoryCheckboxGroup'
  import SingleWebSpider from '@/views/spider/SingleWebSpider'

  export default {
    components: {
      SingleWebSpider,
      ContentCategoryCheckboxGroup,
      SelfDictSelect,
      SiteSelect,
      ChannelInputSelect,
      TinymceEditor,
      TemplateSelect,
      FileUpload
    },
    name: 'ContentAdd',
    data () {
      return {
        form: {
          title: null,
          author: null,
          status: null,
          siteId: null,
          channelId: null,
          contentType: null,
          template: null,
          content: null,
          profile: null,
          publishAt: null,
          imageUrl: null,
          imageDes: null,
          original: null,
          attachments: [
            {
              url: null,
              description: null,
              imageUrl: null,
              imageDes: null,
              type: null,
              size: null
            }
          ],
          categoryIds: [],
          library: {
            url: null,
            description: null,
            imageUrl: null,
            imageDes: null
          },
          libraryImages: [
          ],
          download: {
            url: null,
            description: null,
            imageUrl: null,
            imageDes: null,
            os: null,
            officialName: null,
            officialUrl: null,
            updateTime: null,
            language: null
          },
          downloadImages: [],
          audio: {
            url: null,
            description: null,
            imageUrl: null,
            imageDes: null,
            duration: null,
            player: null,
            director: null,
            performer: null,
            language: null,
            album: null,
            lrc: null,
            region: null,
            years: null
          },
          video: {
            url: null,
            description: null,
            imageUrl: null,
            imageDes: null,
            duration: null,
            player: null,
            otherPlayer: null,
            director: null,
            performer: null,
            language: null,
            region: null,
            seasonCount: 1,
            season: 1,
            spisode: 1,
            spisodeCount: 1,
            years: null
          },
          videoOtherPlayer: [],
          gallerys: []
        },
        // 展开封面图片
        enableCoverImage: false,
        // 展开封面图片
        enableAttachment: false,
        // 第三方播放
        enableVideoOtherPlayer: false,
        addLoading: false,
        formRules: {
          title: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          author: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          siteId: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          channelId: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          contentType: [
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
              self.$http.post('/cms/content', self.form)
                .then(function (response) {
                  self.$message.info('内容添加成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  self.$message.error('内容添加失败，请稍后再试')
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
      addWebSpiderClick () {
        this.$refs.webSpider.show()
      },
      resetForm () {
        this.$refs['form'].resetFields()
        this.$refs.tinymceeditor.setContent('')
      },
      setChannelId (channelId) {
        this.form.channelId = this.$route.query.channelId
        this.$refs.channelinput.initLabelName(channelId)
      },
      uploadCoverImageBtnClick () {
        this.$refs.coverImageUpload.show()
      },
      coverImageUploadSuccess (res, file, fileList) {
        let content = res.data.content
        this.form.imageUrl = content.path
      },
      // 附件上传
      uploadAttachBtnClick (index) {
        let _self = this
        this.$refs.commonUpload.showWithOptions({
          title: '附件',
          data: {path: 'cmsContent'},
          accept: null,
          onSuccess: function (res, file, fileList) {
            let content = res.data.content
            _self.form.attachments[index].url = content.path
            _self.form.attachments[index].ext = content.ext
            _self.form.attachments[index].filename = content.filename
            _self.form.attachments[index].size = content.size
          }
        })
      },
      removeAttachBtnClick (index) {
        if (index !== -1) {
          this.form.attachments.splice(index, 1)
        }
      },
      // 附件图片上传
      uploadAttachImageBtnClick (index) {
        let _self = this
        this.$refs.commonUpload.showWithOptions({
          title: '附件图片',
          data: {path: 'cmsContent'},
          accept: 'image/gif, image/jpeg, image/png',
          onSuccess: function (res, file, fileList) {
            let content = res.data.content
            _self.form.attachments[index].imageUrl = content.path
          }
        })
      },
      uploadDownloadBtnClick () {
        let _self = this
        this.$refs.commonUpload.showWithOptions({
          title: '下载',
          data: {path: 'cmsContent'},
          accept: null,
          onSuccess: function (res, file, fileList) {
            let content = res.data.content
            _self.form.download.url = content.path
            _self.form.download.ext = content.ext
            _self.form.download.filename = content.filename
            _self.form.download.size = content.size
          }
        })
      },
      uploadDownloadImageBtnClick () {
        let _self = this
        this.$refs.commonUpload.showWithOptions({
          title: '下载图片',
          data: {path: 'cmsContent'},
          accept: 'image/gif, image/jpeg, image/png',
          onSuccess: function (res, file, fileList) {
            let content = res.data.content
            _self.form.download.imageUrl = content.path
          }
        })
      },
      removeDownloadImageBtnClick (index) {
        if (index !== -1) {
          this.form.downloadImages.splice(index, 1)
        }
      },
      addDownloadImageForm () {
        this.form.downloadImages.push(
          {
            sequence: 0,
            imageThumbnailUrl: null,
            imageUrl: null,
            imageDes: null
          }
        )
      },
      // 添加附件表单
      addAttachmentForm () {
        this.form.attachments.push({
          url: null,
          description: null,
          imageUrl: null,
          imageDes: null,
          type: null,
          size: null
        })
      },
      // 图库图片上传
      uploadGalleryBtnClick (index) {
        let _self = this
        this.$refs.commonUpload.showWithOptions({
          title: '图库图片',
          data: {path: 'cmsContent'},
          accept: 'image/gif, image/jpeg, image/png',
          onSuccess: function (res, file, fileList) {
            let content = res.data.content
            _self.form.gallerys[index].imageUrl = content.path
            _self.form.gallerys[index].imageThumbnailUrl = content.path
          }
        })
      },
      removeGalleryBtnClick (index) {
        if (index !== -1) {
          this.form.gallerys.splice(index, 1)
        }
      },
      addGallerysForm () {
        this.form.gallerys.push(
          {
            sequence: 0,
            imageThumbnailUrl: null,
            imageUrl: null,
            imageDes: null
          }
        )
      },
      uploadLibraryBtnClick () {
        let _self = this
        this.$refs.commonUpload.showWithOptions({
          title: '文库',
          data: {path: 'cmsContent', convertImage: true},
          accept: 'application/pdf',
          onSuccess: function (res, file, fileList) {
            let content = res.data.content
            _self.form.library.url = content.path
            _self.form.library.ext = content.ext
            _self.form.library.filename = content.filename
            _self.form.library.size = content.size
            if (content.imageUrls) {
              _self.form.libraryImages = []
              content.imageUrls.forEach((item, index) => {
                _self.form.libraryImages.push({
                  imageThumbnailUrl: null,
                  imageUrl: item,
                  imageDes: null,
                  sequence: index
                })
              })
            }
          }
        })
      },
      uploadLibraryImageBtnClick () {
        let _self = this
        this.$refs.commonUpload.showWithOptions({
          title: '文库图片',
          data: {path: 'cmsContent'},
          accept: 'image/gif, image/jpeg, image/png',
          onSuccess: function (res, file, fileList) {
            let content = res.data.content
            _self.form.library.imageUrl = content.path
          }
        })
      },
      uploadAudioBtnClick () {
        let _self = this
        this.$refs.commonUpload.showWithOptions({
          title: '音频',
          data: {path: 'cmsContent'},
          accept: null,
          onSuccess: function (res, file, fileList) {
            let content = res.data.content
            _self.form.audio.url = content.path
            _self.form.audio.ext = content.ext
            _self.form.audio.filename = content.filename
            _self.form.audio.size = content.size
          }
        })
      },
      uploadAudioImageBtnClick () {
        let _self = this
        this.$refs.commonUpload.showWithOptions({
          title: '音频图片',
          data: {path: 'cmsContent'},
          accept: 'image/gif, image/jpeg, image/png',
          onSuccess: function (res, file, fileList) {
            let content = res.data.content
            _self.form.audio.imageUrl = content.path
          }
        })
      },
      uploadVideoBtnClick () {
        let _self = this
        this.$refs.commonUpload.showWithOptions({
          title: '视频',
          data: {path: 'cmsContent'},
          accept: null,
          onSuccess: function (res, file, fileList) {
            let content = res.data.content
            _self.form.video.url = content.path
            _self.form.video.ext = content.ext
            _self.form.video.filename = content.filename
            _self.form.video.size = content.size
          }
        })
      },
      uploadVideoImageBtnClick () {
        let _self = this
        this.$refs.commonUpload.showWithOptions({
          title: '视频图片',
          data: {path: 'cmsContent'},
          accept: 'image/gif, image/jpeg, image/png',
          onSuccess: function (res, file, fileList) {
            let content = res.data.content
            _self.form.video.imageUrl = content.path
          }
        })
      },
      videoOtherPlayerHasValue () {
        let r = false
        for (let i = 0; i < this.form.videoOtherPlayer.length; i++) {
          if (this.form.videoOtherPlayer[i].url) {
            r = true
            break
          }
        }
        return r
      },
      removeVideoOtherPlayerBtnClick (index) {
        if (index !== -1) {
          this.form.videoOtherPlayer.splice(index, 1)
        }
      },
      addVideoOtherPlayerForm () {
        this.form.videoOtherPlayer.push(
          {
            player: null,
            url: null
          }
        )
      },
      spiderSuccess (res) {
        let content = res.data.data.content
        this.form.title = content.title
        this.form.content = content.content
      }
    },
    computed: {
    },
    watch: {
    },
    beforeRouteEnter  (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        let dataControl = 'ContentAddLoadData=true'
        if (loadDataControl.has(vm.$store, dataControl)) {
          // 重置表单
          vm.resetForm()
          loadDataControl.remove(vm.$store, dataControl)
        }

        if (vm.form.siteId !== vm.$route.query.siteId && vm.$route.query.siteId) {
          vm.form.siteId = vm.$route.query.siteId
        }
        if (vm.$route.query.channelId) {
          vm.setChannelId(vm.$route.query.channelId)
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrapper{
  padding:1.5rem;
  height: 100%;
  overflow-y: auto;
}
  .my-image-preview{
    width:150px;
    height: 150px;
    border: 1px solid gainsboro;
  }
</style>
