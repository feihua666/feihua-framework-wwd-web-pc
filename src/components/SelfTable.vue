<template>
 <div>
   <el-table v-loading="tableLoading"
             border stripe
     size="mini"
     style="width: 100%" :data="tableData">
     <template  v-for="item in columns">
       <el-table-column v-if="item.buttons" :prop="item.name" :label="item.label" :key="item.name" :formatter="item.formatter" :width="item.width" :fixed="item.fixed">
         <template slot-scope="scope">
           <el-button v-for="btn in item.buttons"  :key="scope.$index"
                      @click.native.prevent="btn.click(scope.$index, scope.row)"
                      type="text"
                      size="small"
                      :disabled="btnDisabled(btn.disabled, scope.$index, scope.row)"
           >
             <template v-if="typeof btn.label == 'function'">
               {{btn.label(scope.$index, scope.row)}}
             </template>
             <template v-else-if="btn.label">
               {{btn.label}}
             </template>
             <template v-else-if="btn.html">
               <div v-if="typeof btn.html == 'function'" v-html="btn.html(scope.row)"></div>
               <div v-else v-html="btn.html"></div>
             </template>
             <template v-else>
               <div v-if="item.html" v-html="item.html(scope.row)"></div>
               <template v-else>
                 {{item.formatter ? item.formatter(scope.row) : (item.dict ? getDictLabel(item.dict, scope.row[item.name]) : scope.row[item.name])}}
               </template>
             </template>
           </el-button>
         </template>

       </el-table-column>
       <el-table-column v-else-if="item.dict" :prop="item.name" :label="item.label" :key="item.name" :formatter="item.formatter" :width="item.width">
         <template slot-scope="scope">
         {{getDictLabel(item.dict, scope.row[item.name],item.dictValue)}}
         </template>
       </el-table-column>
       <el-table-column v-else-if="item.html" :prop="item.name" :label="item.label" :key="item.name" :formatter="item.formatter" :width="item.width">
         <template slot-scope="scope">
           <div v-if="item.html" v-html="item.html(scope.row)"></div>
         </template>
       </el-table-column>
       <el-table-column v-else :prop="item.name" :label="item.label" :key="item.name" :formatter="item.formatter" :width="item.width">
       </el-table-column>
     </template>

   </el-table>
   <self-page v-if="page.dataNum > 0" :dataNum="page.dataNum" :pageNo="page.pageNo" :pageSize="page.pageSize" v-on:pageSizeChange="pageSizeChange" v-on:pageNoChange="pageNoChange">
   </self-page>
 </div>
</template>

<script>
  import SelfPage from '@/components/SelfPage.vue'
  import { getDictByValueSync } from '@/utils/dictUtils.js'
  export default {
    name: 'SelfTable',
    components: {
      SelfPage
    },
    props: {
      showPage: {
        default: true
      },
      columns: {
        default: function () {
          return []
        }
      },
      tableData: {
        default: function () {
          return []
        }
      },
      tableLoading: false,
      page: {
        default: function () {
          return {
            pageNo: 1,
            pageSize: 10,
            dataNum: 0
          }
        }
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
      },
      getDictLabel (type, value, dictValue) {
        let dict = getDictByValueSync(this, type, value)
        let str = dict ? dict.name : null
        if (str && dictValue) {
          str = str + '(' + value + ')'
        }
        return str
      },
      btnDisabled (disabled, index, row) {
        if (typeof disabled === 'function') {
          return disabled(index, row)
        } else {
          return disabled
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
