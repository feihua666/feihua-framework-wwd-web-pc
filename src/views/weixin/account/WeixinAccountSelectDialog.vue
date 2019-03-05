<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="30%">
    <weixin-account-select v-model="which"></weixin-account-select>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submit">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
  import WeixinAccountSelect from '@/views/weixin/account/WeixinAccountSelect'

  export default {
    name: 'WeixinAccountSelectDialog',
    components: {
      WeixinAccountSelect
    },
    props: {
      // 选择成功回调
      onSuccess: null,
      // 弹窗标题
      title: {
        default: '请选择公众平台帐号'
      }
    },
    data () {
      return {
        dialogVisible: false,
        which: null
      }
    },
    mounted () {
    },
    computed: {

    },
    methods: {
      show () {
        this.dialogVisible = true
      },
      hide () {
        this.dialogVisible = false
      },
      submit () {
        if (this.which === '' || this.which == null) {
          this.$message.error('请选择公众平台帐号')
          return
        }
        if (this.onSuccess && typeof this.onSuccess === 'function') {
          this.onSuccess(this.which)
        }
        this.hide()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

