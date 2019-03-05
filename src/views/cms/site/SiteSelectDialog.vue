<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="30%">

    <SiteSelect ref="siteinput"  v-model="siteId">
    </SiteSelect>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submit">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
  import SiteSelect from '@/views/cms/site/SiteSelect.vue'

  export default {
    name: 'SiteSelectDialog',
    components: {
      SiteSelect
    },
    props: {
      // 选择成功回调
      onSuccess: null,
      // 弹窗标题
      title: {
        default: '请选择站点'
      }
    },
    data () {
      return {
        dialogVisible: false,
        siteId: null
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
        if (this.siteId === '' || this.siteId == null) {
          this.$message.error('请选择站点')
          return
        }
        if (this.onSuccess && typeof this.onSuccess === 'function') {
          this.onSuccess(this.siteId)
        }
        this.hide()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

