<template>
 <div>
   <el-table v-loading="tableLoading" :default-sort="defaultSort" @sort-change="sortChange"
             border stripe
     size="mini"
     style="width: 100%" :data="mytableData">
     <template  v-for="item in columns">
       <el-table-column  v-if="item.buttons" :prop="item.name" :label="item.label" :key="item.name" :formatter="item.formatter" :width="item.width" :fixed="item.fixed">
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
               <div v-if="item.html" v-html="item.html(scope.$index,scope.row)"></div>
               <template v-else>
                 {{item.formatter ? item.formatter(scope.row) : (item.dict ? scope.row[item.dict + '' + scope.$index] ?scope.row[item.dict + '' + scope.$index]:setDictLabel(scope.$index,scope.row,item) : scope.row[item.name])}}
               </template>
             </template>
           </el-button>
         </template>

       </el-table-column>
       <el-table-column v-else-if="item.dict" :prop="item.name" :label="item.label" :key="item.name" :formatter="item.formatter" :width="item.width">
         <template slot-scope="scope">
         {{scope.row[item.dict + '' + scope.$index] ?scope.row[item.dict + '' + scope.$index]:setDictLabel(scope.$index,scope.row,item)}}
         </template>
       </el-table-column>
       <el-table-column v-else-if="item.html" :prop="item.name" :label="item.label" :key="item.name" :formatter="item.formatter" :width="item.width">
         <template slot-scope="scope">
           <div v-if="item.html" v-html="item.html(scope.$index,scope.row)"></div>
         </template>
       </el-table-column>
       <el-table-column v-else-if="item.image" :prop="item.name" :label="item.label" :key="item.name" :formatter="item.formatter" :width="item.width">
         <template slot-scope="scope">
           <div v-if="item.image" v-html="getImage(scope.row,item)"></div>
         </template>
       </el-table-column>
       <el-table-column v-else :prop="item.name" :label="item.label" :key="item.name" :formatter="item.formatter" :width="item.width"  :sort-by="item.sortBy" :sortable="item.sortable ? item.sortable : false">
       </el-table-column>
     </template>

   </el-table>
   <self-page v-if="page.dataNum > 0" :dataNum="page.dataNum" :pageNo="page.pageNo" :pageSize="page.pageSize" v-on:pageSizeChange="pageSizeChange" v-on:pageNoChange="pageNoChange">
   </self-page>
 </div>
</template>

<script>
  import SelfPage from '@/components/SelfPage.vue'
  export default {
    name: 'SelfTable',
    components: {
      SelfPage
    },
    props: {
      showPage: {
        default: true
      },
      defaultSort: {
        default: function () {
          return {}
        }
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
        mytableData: []
      }
    },
    mounted () {
    },
    watch: {
      tableData (val) {
        this.mytableData = val
      }
    },
    methods: {
      // 排序
      sortChange (val) {
        if (val && val.column.sortable != null) {
          // 加了sortBy字段才返回
          if (val.column.sortBy) {
            if (val.order === 'descending') {
              val.sortBy = val.column.sortBy + '-desc'
            } else {
              val.sortBy = val.column.sortBy + '-asc'
            }
            this.$emit('sortChange', val)
          }
        }
      },
      // 页面大小改变重新查询数据
      pageSizeChange (val) {
        this.$emit('pageSizeChange', val)
      },
      // 页码改变加载对应页码数据
      pageNoChange (val) {
        this.$emit('pageNoChange', val)
      },
      setDictLabel (index, row, colItem) {
        let self = this
        let attr = colItem.dict + '' + index
        let value = self.$utils.dGetValue(row, colItem.name)
        row[attr] = value
        self.$http.getDictByValue(colItem.dict, value)
          .then(function (dict) {
            let str = dict.name
            if (str && colItem.dictValue) {
              str = str + '(' + value + ')'
            }
            row[attr] = str
            self.mytableData.splice(index, 1, row)
          }).catch(function () {
            self.mytableData.splice(index, 1, row)
          })
      },
      btnDisabled (disabled, index, row) {
        if (typeof disabled === 'function') {
          return disabled(index, row)
        } else {
          return disabled
        }
      },
      getImage (row, item) {
        let url = null
        if (row[item.name]) {
          url = this.$config.file.getDownloadUrl(row[item.name])
        } else {
          url = require('@/assets/index/headPic.jpg')
        }
        // eslint-disable-next-line
        let image = '<img width="30px" height="30px" src="' + url + '"/>'
        return image
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
