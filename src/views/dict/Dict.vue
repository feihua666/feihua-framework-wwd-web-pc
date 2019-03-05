<template>

  <div class="wrapper">
    <el-container>
      <el-aside width="200px">
        <el-scrollbar style="height: 100%;" wrapStyle="height:100%;overflow:auto;" >
        <dict-tree ref="lefttree" v-on:nodeClick="treeNodeClick"></dict-tree>
        </el-scrollbar>
      </el-aside>
      <el-main>
        <el-collapse value="1">
          <el-collapse-item title="查询条件" name="1">
            <el-form ref="searchForm" :model="searchFormModel" :inline="true" size="small">
              <el-form-item label="字典值" prop="value">
                <el-input  v-model="searchFormModel.value"></el-input>
              </el-form-item>
              <el-form-item label="字典名" prop="name">
                <el-input  v-model="searchFormModel.name"></el-input>
              </el-form-item>
              <el-form-item label="字典类型" prop="type">
                <el-input  v-model="searchFormModel.type"></el-input>
              </el-form-item>
              <el-form-item label="是否系统" prop="isSystem">
                <self-dict-select v-model="searchFormModel.isSystem" type="yes_no"></self-dict-select>
              </el-form-item>
              <el-form-item label="父级">
                <DictInputSelect ref="dictinput"  v-model="searchFormModel.parentId">
                </DictInputSelect>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchBtnClick">查询</el-button>
                <el-button type="primary" @click="addTableRowClick">添加</el-button>
                <el-button @click="resetFormClick">重置</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <self-table :columns="columns" :tableData="tableData" :page="page" :table-loading="tableLoading" v-on:pageSizeChange="pageSizeChange" v-on:pageNoChange="pageNoChange"></self-table>
      </el-main>
    </el-container>

  </div>
</template>

<script>
  import DictTree from './DictTree.vue'
  import SelfPage from '@/components/SelfPage.vue'
  import SelfTable from '@/components/SelfTable.vue'
  import loadDataControl from '@/utils/storeLoadDataControlUtils.js'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import { getDictByValueSync } from '@/utils/dictUtils.js'
  import DictInputSelect from '@/views/dict/DictInputSelect'
  export default {
    name: 'Dict',
    components: {
      SelfDictSelect,
      SelfTable,
      DictTree,
      SelfPage,
      DictInputSelect
    },
    data () {
      return {
        columns: [
          {
            name: 'value',
            label: '字典值'
          },
          {
            name: 'name',
            label: '字典名'
          },
          {
            name: 'type',
            label: '类型'
          },
          {
            name: 'isSystem',
            label: '是否系统',
            formatter: this.isSystemFormatter
          },
          {
            name: 'sequence',
            label: '顺序'
          },
          {
            name: 'parentId',
            label: '父级',
            formatter: this.dataParentFormatter
          },
          {
            name: 'dataOfficeId',
            label: '机构',
            formatter: this.dataOfficeFormatter
          },
          {
            name: 'dataAreaId',
            label: '区域',
            formatter: this.dataAreaFormatter
          },
          {
            label: '操作',
            width: '150',
            buttons: [
              {
                label: '编辑',
                click: this.editTableRowClick
              },
              {
                label: '删除',
                click: this.deleteTableRowClick
              }
            ]
          }
        ],
        page: {
          pageNo: 1,
          dataNum: 0
        },
        tableOffice: {},
        tableParent: {},
        tableArea: {},
        // 表格数据
        tableData: [],
        tableLoading: false,
        // 搜索的查询条件
        searchFormModel: {
          value: '',
          name: '',
          type: '',
          isSystem: '',
          parentId: '',
          orderby: 'sequence',
          includeOffice: true,
          includeParent: true,
          includeArea: true,
          pageable: true,
          pageNo: 1,
          pageSize: 10
        }
      }
    },
    mounted () {
      this.loadTableData(1)
    },
    methods: {
      // 点击树节点事件
      treeNodeClick (data) {
        this.$refs.dictinput.setLabelName(data.name)
        this.searchFormModel.parentId = data.id
        this.searchBtnClick()
      },
      resetFormClick () {
        this.$refs['searchForm'].resetFields()
        this.$refs.dictinput.setLabelName(null)
        this.searchFormModel.parentId = null
      },
      // 查询按钮点击事件
      searchBtnClick () {
        this.loadTableData(1)
      },
      // 加载表格数据
      // 发现一个问题，这里还没有想到好的解决方式，这里限制一下
      // 问题描述：首先数据不只一页，点击下一页，这时再点击查询时，由于查询是从第一页开始的，所以查询的同时，也触发了页面改变事件，会查询两次
      loadTableData (pageNo, pageNoChange) {
        let self = this
        if (pageNo > 0) {
          if (pageNoChange) {
            self.searchFormModel.pageNo = pageNo
          } else {
            if (self.page.pageNo !== pageNo) {
              self.page.pageNo = pageNo
              return
            }
          }
        }
        self.tableLoading = true
        this.$http.get('/base/dicts', self.searchFormModel)
          .then(function (response) {
            let content = response.data.data.content
            self.tableOffice = response.data.data.office
            self.tableParent = response.data.data.parent
            self.tableArea = response.data.data.area
            self.tableData = content
            self.page.dataNum = response.data.data.page.dataNum
            self.tableLoading = false
          })
          .catch(function (error) {
            if (error.response.status === 404) {
              self.tableData = []
              self.page.dataNum = 0
              self.tableOffice = {}
              self.tableParent = {}
              self.tableArea = {}
            }
            self.tableLoading = false
          })
      },
      // 页面大小改变重新查询数据
      pageSizeChange (val) {
        this.searchFormModel.pageSize = val
        this.searchBtnClick()
      },
      // 页码改变加载对应页码数据
      pageNoChange (val) {
        this.page.pageNo = val
        this.loadTableData(val, true)
      },
      // tablb 表格编辑行
      editTableRowClick (index, row) {
        this.$router.push('/Main/DictEdit/' + row.id)
      },
      // tablb 表格删除行
      deleteTableRowClick (index, row) {
        let self = this
        this.$confirm('确定要删除吗, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          this.$http.delete('/base/dict/' + row.id)
            .then(function (response) {
              self.$message.success('删除成功')
              // 重新加载数据
              self.searchBtnClick()
            })
            .catch(function (error) {
              if (error.response.status === 404) {
                self.$message.error('删除失败，请刷新数据再试')
              }
            })
        })
      },
      addTableRowClick () {
        loadDataControl.add(this.$store, 'DictAddLoadData=true')
        this.$router.push('/Main/DictAdd')
      },
      isSystemFormatter (row) {
        let dict = getDictByValueSync(this, 'yes_no', row.isSystem)
        return dict ? dict.name : null
      },
      dataOfficeFormatter (row) {
        let dataOfficeName = null
        if (this.tableOffice && this.tableOffice[row.dataOfficeId]) {
          dataOfficeName = this.tableOffice[row.dataOfficeId].name || null
        }
        return dataOfficeName
      },
      dataParentFormatter (row) {
        let name = null
        if (this.tableParent && this.tableParent[row.parentId]) {
          name = this.tableParent[row.parentId].name || null
        }
        return name
      },
      dataAreaFormatter (row) {
        let name = null
        if (this.tableParent && this.tableParent[row.dataAreaId]) {
          name = this.tableParent[row.dataAreaId].name || null
        }
        return name
      }
    },
    watch: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .wrapper .el-collapse{
    padding: 0 10px;
  }
.el-main{
  padding:0;
}
.el-aside{
  border-right: 1px solid #e6ebf5;
}
.wrapper,.el-container{
  height:100%;
}
</style>
<style>
.el-collapse-item__arrow {
  /* 由于用了rotate 这个东西不是个正方形所以改变角度的时候会出现滚动条 */
  margin-right: 20px;
}
</style>
