<template>
  <el-pagination
    background
    @size-change="pageSizeChange"
    @current-change="pageNoChange"
    :current-page="pageNo"
    :page-sizes="[10, 20, 50, 100]"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="dataNum"
    style="text-align: right;">
  </el-pagination>
</template>

<script>
  export default {
    name: 'SelfPage',
    props: {
      pageNo: {
        default: 1
      },
      pageSize: {
        default: 10
      },
      dataNum: {
        default: 0
      }
    },
    data () {
      return {
      }
    },
    mounted () {
    },
    methods: {
      // 页面大小改变重新查询数据
      pageSizeChange (val) {
        this.$emit('pageSizeChange', val)
      },
      // 页码改变加载对应页码数据
      pageNoChange (val) {
        this.$emit('pageNoChange', val)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
