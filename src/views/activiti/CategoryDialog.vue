<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="30%">

    <el-form  ref="categoryform" :model="form" :rules="formRules" :inline="true" size="small">
      <el-form-item prop="category" label="分类">
        <self-dict-select  v-model="form.category" type="activity_process_category"></self-dict-select>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submit">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
  import SelfDictSelect from '@/components/SelfDictSelect'

  export default {
    components: {SelfDictSelect},
    name: 'CategaryDialog',
    props: {
      submitClick: null,
      // 弹窗标题
      title: {
        default: '设置分类'
      }
    },
    data () {
      return {
        dialogVisible: false,
        form: {
          category: ''
        },
        param: null,
        formRules: {
          category: [
            {required: true, message: '必填', trigger: 'blur'}
          ]
        }
      }
    },
    mounted () {
    },
    methods: {
      show () {
        this.dialogVisible = true
        if (this.$refs['categoryform']) {
          this.$refs['categoryform'].resetFields()
        }
      },
      hide () {
        this.dialogVisible = false
      },
      setCategory (value) {
        let self = this
        setTimeout(function () {
          self.form.category = value
        }, 10)
      },
      getCategory () {
        return this.form.category
      },
      setParam (param) {
        this.param = param
      },
      getParam () {
        return this.param
      },
      submit () {
        let self = this
        this.$refs['categoryform'].validate((valid) => {
          if (valid) {
            if (typeof self.submitClick === 'function') {
              self.submitClick(self.form.category, this.param)
            }
          } else {
            return false
          }
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
