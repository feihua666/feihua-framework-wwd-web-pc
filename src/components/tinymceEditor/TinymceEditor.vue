<template>
 <div  v-loading="pasteUploading" element-loading-text="粘贴图片上传中">
   <textarea  :id="tinymceId" class="tinymce-textarea"></textarea >
   <file-upload ref="fileupload" :on-success="uploadSuccess" :data="{path: path}" accept="image/gif, image/jpeg, image/png" :limit="1" title="图片上传"></file-upload>

 </div>
</template>

<script>
  import tinymce from 'tinymce/tinymce'
  import '@/components/tinymceEditor/zh_CN.js'
  import 'tinymce/themes/modern/theme'
  import 'tinymce/plugins/advlist'
  import 'tinymce/plugins/anchor'
  import 'tinymce/plugins/autolink'
  import 'tinymce/plugins/autosave'
  import 'tinymce/plugins/code'
  import 'tinymce/plugins/codesample'
  import 'tinymce/plugins/colorpicker'
  import 'tinymce/plugins/contextmenu'
  import 'tinymce/plugins/directionality'
  import 'tinymce/plugins/emoticons'
  import 'tinymce/plugins/fullscreen'
  import 'tinymce/plugins/hr'
  import 'tinymce/plugins/image'
  import 'tinymce/plugins/imagetools'
  import 'tinymce/plugins/importcss'
  import 'tinymce/plugins/insertdatetime'
  import 'tinymce/plugins/link'
  import 'tinymce/plugins/lists'
  import 'tinymce/plugins/media'
  import 'tinymce/plugins/nonbreaking'
  import 'tinymce/plugins/noneditable'
  import 'tinymce/plugins/pagebreak'
  import 'tinymce/plugins/paste'
  import 'tinymce/plugins/preview'
  import 'tinymce/plugins/print'
  import 'tinymce/plugins/save'
  import 'tinymce/plugins/searchreplace'
  import 'tinymce/plugins/spellchecker'
  import 'tinymce/plugins/tabfocus'
  import 'tinymce/plugins/table'
  import 'tinymce/plugins/template'
  import 'tinymce/plugins/textcolor'
  import 'tinymce/plugins/textpattern'
  import 'tinymce/plugins/visualblocks'
  import 'tinymce/plugins/visualchars'
  import 'tinymce/plugins/wordcount'
  import 'tinymce/skins/lightgray/skin.min.css'
  import FileUpload from '@/components/FileUploadDialog.vue'
  import $ from 'jquery'
  const plugins = ['advlist anchor autolink autosave code codesample colorpicker contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount']
  const toolbar = ['bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample', 'hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen mybutton']
  export default {
    name: 'TinymceEditor',
    components: {FileUpload},
    props: {
      id: {
        type: String,
        default: function () {
          return 'vue-tinymce-' + new Date().getTime() + '-' + ((Math.random() * 1000).toFixed(0) + '')
        }
      },
      value: {
        type: String,
        default: ''
      },
      path: {
        default: 'upload'
      }
    },
    data () {
      return {
        hasInit: false,
        flag: true,
        showFileUpload: false,
        model: this.value,
        tinymceId: this.id,
        pasteUploading: false
      }
    },
    mounted () {
      this.init()
    },
    activated () {
      this.init()
    },
    deactivated () {
      this.destroyTinymce()
    },
    destroyed () {
      this.destroyTinymce()
    },
    methods: {
      init () {
        let _self = this
        tinymce.init({
          selector: '#' + _self.tinymceId,
          height: 300,
          toolbar: toolbar,
          image_advtab: true,
          paste_data_images: true,
          paste_preprocess: function (plugin, args) {
            // 图片粘贴处理自动上传
            if (args.content && args.content.indexOf('<img src="blob:http') === 0) {
              // 是粘贴的图片
              let imageUrl = $(args.content).attr('src')
              args.content = ''
              _self.pasteUploading = true
              _self.$utils.file.imageToDataUrl(imageUrl).then(function (dataUrl) {
                let file = _self.$utils.file.dataUrltoFile(dataUrl)
                _self.$http.uploadFile(file, {path: _self.path}).then(function (res) {
                  let resContent = res.data.data.content
                  _self.insertContent('<img src="' + _self.$config.file.getDownloadUrl(resContent.path) + '"/>')
                  _self.pasteUploading = false
                }).catch(function () {
                  _self.pasteUploading = false
                })
              })
            }
          },
          init_instance_callback: editor => {
            if (_self.model) {
              editor.setContent(_self.model)
            }
            _self.hasInit = true
            editor.on('NodeChange Change KeyUp SetContent input undo redo', () => {
              _self.flag = false
              _self.$emit('input', editor.getContent())
            })
          },
          plugins: plugins,
          setup: function (editor) {
            editor.addButton('mybutton', {
              type: 'splitbutton',
              text: '图片上传',
              icon: false,
              onclick: function () {
                _self.$refs.fileupload.show()
              },
              menu: [{
                text: '预留',
                onclick: function () {
                  _self.$message.warning('预留功能，敬请期待')
                }
              }]
            })
          }
        })
      },
      destroyTinymce () {
        if (tinymce.get(this.tinymceId)) {
          tinymce.get(this.tinymceId).destroy()
        }
      },
      setContent (value) {
        if (value) {
          tinymce.get(this.tinymceId).setContent(value)
        }
      },
      getContent () {
        tinymce.get(this.tinymceId).getContent()
      },
      insertContent (val) {
        tinymce.get(this.tinymceId).insertContent(val)
      },
      uploadSuccess (res, file, fileList) {
        let content = res.data.content
        let self = this
        self.insertContent(`<img src="${self.$config.file.getDownloadUrl(content.path)}" >`)
      }
    },
    watch: {
      value (val) {
        this.model = val
      },
      model (val) {
        if (this.hasInit && this.flag) {
          this.setContent(val)
        }
        this.flag = true
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
