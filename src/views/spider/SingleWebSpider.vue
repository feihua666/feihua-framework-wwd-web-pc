<template>
  <el-dialog class="web-spider-dialog"
    title="抓取网页"
    :visible.sync="dialogVisible"
    width="30%">
    <el-form ref="form" :model="form" :rules="formRules" label-width="150px">
      <el-form-item label="预定义来源" prop="dynamic">
        <el-select  v-model="form.type">
          <el-option label="默认"  value="default"></el-option>
          <el-option v-for="item in type"  :label="item.name"  :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="网址" prop="url" required>
        <el-input  v-model="form.url"></el-input>
      </el-form-item>

      <el-form-item label="网页类型" prop="dynamic">
        <el-select  v-model="form.dynamic">
          <el-option  label="动态网页"  :value="true"></el-option>
          <el-option  label="静态网页"  :value="false" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.dynamic" label="等待时间（秒）" prop="dynamicWaitSecond" required>
        <el-input  v-model="form.dynamicWaitSecond"></el-input>
      </el-form-item>
      <template v-for="(val, key, index) in form.selector">
        <el-form-item :label="key" :prop="'selector[' + key + ']'" :key="index" required>
          <el-input  v-model="form.selector[key]"></el-input>
        </el-form-item>
      </template>

    </el-form>


    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitbb" :loading="loading">开始抓取并填充</el-button>
  </span>
  </el-dialog>
</template>

<script>
  export default {
    name: 'SingleWebSpider',
    props: {
      selector: {},
      success: null
    },
    data () {
      return {
        dialogVisible: false,
        loading: false,
        type: [
          {
            id: '1',
            name: '今日头条',
            value: 'jrtt',
            selector: {
              title: '.article-box .article-title:text',
              publishAt: '.article-box .article-sub span:eq(0):text',
              original: '.article-box .article-sub span:eq(1):text',
              content: '.article-box .article-content'
            }
          }
        ],
        form: {
          qsDefault: true,
          type: 'default',
          selector: {},
          dynamicWaitSecond: 3,
          dynamic: true,
          url: null
        },
        formRules: {
          url: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          dynamic: [
            {required: true, message: '必填', trigger: 'blur'}
          ]
        }
      }
    },
    mounted () {
      this.form.selector = this.selector
    },
    methods: {
      show () {
        this.dialogVisible = true
      },
      hide () {
        this.dialogVisible = false
      },
      submitbb () {
        let self = this
        if (self.loading === false) {
          self.loading = true
          this.$refs['form'].validate((valid) => {
            if (valid) {
              self.$http.post('/spider/fetch', self.form).then(res => {
                // let content = res.data.data.content
                self.loading = false
                if (typeof self.success === 'function') {
                  self.success(res)
                }
              }).catch(() => {
                self.loading = false
              })
            } else {
              return false
            }
          })
        } else {
          self.$message.info('正在请求中，请耐心等待')
        }
      }
    },
    watch: {
      'form.type' (val) {
        if (val) {
          if (val === 'default') {
            this.form.selector = this.selector
          } else {
            for (let i = 0; i < this.type.length; i++) {
              if (val === this.type[i].id) {
                this.form.selector = this.type[i].selector
              }
            }
          }
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
