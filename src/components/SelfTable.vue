<template>
  <div>
    <el-table v-loading="tableLoading" :default-sort="defaultSort" @sort-change="sortChange"
              border stripe
              header-row-class-name="fh-self-table-header"
              size="mini"
              style="width: 100%" :data="mytableData">
      <template  v-for="(item, index) in columns">
        <el-table-column :show-overflow-tooltip="item.showOverflowTooltip" :type="item.type" v-if="item.showInTable !== false && (item.dict || item.html || item.image || item.type == 'expand' || item.buttons)" :prop="item.name" :label="item.label" :key="index" :width="item.width" :fixed="item.fixed">

          <template   slot-scope="scope">
            <!-- 展开内容 showInExpand参数可 控制是否在展开行显示-->
            <el-form v-if="item.type == 'expand'" label-position="left" inline class="fh-table-expand">
              <el-form-item v-for="(iitem, index) in columns" v-if="iitem.type !== 'expand' && iitem.type !== 'index' && iitem.type !== 'selection' && iitem.showInExpand !==false && !iitem.buttons" :label="iitem.label" :key="index">
                <template v-if="iitem.dict">
                  {{scope.row[iitem.dict + '' + scope.$index] ?scope.row[iitem.dict + '' + scope.$index]:setDictLabel(scope.$index,scope.row,iitem)}}
                </template>
                <div v-else-if="iitem.image" v-html="getImage(scope.row,iitem)"></div>
                <div v-else-if="iitem.html" v-html="iitem.html(scope.$index,scope.row)"></div>
                <template v-else>
                  <span>{{iitem.formatter ? iitem.formatter(scope.row) : $utils.dGetValue(scope.row, iitem.name)}}</span>
                </template>
              </el-form-item>
            </el-form>
            <!-- showInTable 作用，表格中是否显示该列，因为行展开与表格共用一个配置项colums，这样可以实现不在表格中展示，但展开行可以展示 -->
            <template v-else-if="item.showInTable !== false">
              <template v-if="item.dict">
                {{scope.row[item.dict + '' + scope.$index] ?scope.row[item.dict + '' + scope.$index]:setDictLabel(scope.$index,scope.row,item)}}
              </template>
              <div v-else-if="item.html" v-html="item.html(scope.$index,scope.row)"></div>
              <div v-else-if="item.image" v-html="getImage(scope.row,item)"></div>
              <template v-else-if="item.buttons">
                <!-- 两种方式，一种下拉按钮，一种正常排列按钮 -->
                <el-dropdown v-if="item.dropdown && item.buttons.length > 1" trigger="click" size="mini"
                             :type="item.buttons[0].styleType"
                             split-button @click="item.buttons[0].click(scope.$index, scope.row)"
                             :disabled="btnDisabled(item.buttons[0].disabled, scope.$index, scope.row)"
                >
                  <i v-if="item.buttons[0].icon" :class="item.buttons[0].icon"></i>{{item.buttons[0].label}}
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(btn,index) in item.buttons"
                                      v-if="index > 0"
                                      :key="btn.label">
                      <el-button
                        :type="btn.styleType"
                        :icon="btn.icon"
                        size="mini"
                        style="padding:2px 5px;"
                        :disabled="btnDisabled(btn.disabled, scope.$index, scope.row)"
                        @click="btn.click(scope.$index, scope.row)">{{btn.label}}</el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-button v-else v-for="btn in item.buttons"  :key="scope.$index"
                           @click.native.prevent="btn.click(scope.$index, scope.row)"
                           :type="btn.styleType"
                           size="mini"
                           style="padding:2px 5px;"
                           :icon="btn.icon"
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
                      {{item.formatter ? item.formatter(scope.row) :  $utils.dGetValue(scope.row, item.name)}}
                    </template>
                  </template>
                </el-button>
              </template>
            </template>

          </template>

        </el-table-column>
        <el-table-column :show-overflow-tooltip="item.showOverflowTooltip" v-else-if="item.showInTable !== false" :type="item.type" :prop="item.name" :label="item.label" :key="item.name" :formatter="item.formatter" :width="item.width"  :sort-by="item.sortBy" :sortable="item.sortable ? item.sortable : false">
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
      /**
       * 除了element 表格原生属性，还有一些扩展
       * {
       * // dict html image 只能用一个
       *     dict: 'yes_no',
       *     dictValue: true, // 把字典值也显示出来
       *     html: function(index,row){},
       *     image: true,
       *     buttons: [{
       *     // label或html只能用一个
       *        label: '编辑', // function(index,row){}||string
       *        html: '编辑', // function(index,row){}
                styleType: 'primary',
                icon: 'el-icon-edit',
                click: this.editTableRowClick
       *     }]
       * }
       */
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
        let self = this
        // 统一提前加载字典
        let ditcs = ''
        for (let i = 0; i < self.columns.length; i++) {
          if (self.columns[i].dict) {
            ditcs += self.columns[i].dict
            if (i < self.columns.length - 1) {
              ditcs += ','
            }
          }
        }
        // 如果包含字典
        if (ditcs) {
          self.$http.getDictsByType(ditcs).then(function () {
            self.mytableData = val
          }).catch(function () {
            self.mytableData = val
          })
        } else {
          self.mytableData = val
        }
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
        let value = this.$utils.dGetValue(row, item.name)
        if (value) {
          url = this.$config.file.getDownloadUrl(value)
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
  .fh-table-expand {
    font-size: 0;
  }
  .fh-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .fh-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

</style>
<style>
  .el-table tr.fh-self-table-header, .el-table tr.fh-self-table-header  th{
    background-color: #eff3f8;
  }
  .el-table .el-button [class*=el-icon-]+span{
    margin-left: -3px;
  }
  .el-button-group .el-button--mini {
    padding: 2px 5px !important;
  }
</style>
