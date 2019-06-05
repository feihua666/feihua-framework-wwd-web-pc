<template>

    <el-container  class="fh-page-wrapper">
      <el-aside width="200px" class="fh-tree-aside">
        <el-scrollbar style="height: 100%;" wrapStyle="height:100%;overflow:auto;" >
          <funResource-tree ref="lefttree" v-on:nodeClick="treeNodeClick"></funResource-tree>
         </el-scrollbar>
      </el-aside>
      <el-main>
        <el-collapse value="1">
          <el-collapse-item title="查询条件" name="1">
            <el-form ref="searchForm" :model="searchFormModel" :inline="true" size="small">
              <el-form-item label="名称" prop="name">
                <el-input  v-model="searchFormModel.name"></el-input>
              </el-form-item>
              <el-form-item label="类型" prop="type">
                <self-dict-select v-model="searchFormModel.type" type="funResource_type"></self-dict-select>
              </el-form-item>
              <el-form-item label="是否显示" prop="isShow">
                <self-dict-select v-model="searchFormModel.isShow" type="yes_no"></self-dict-select>
              </el-form-item>
              <el-form-item label="父级">
                <fun-resource-input-select ref="funResourceinput" v-model="searchFormModel.parentId"></fun-resource-input-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="searchBtnClick">查询</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="addTableRowClick">添加</el-button>
                <el-button type="warning" icon="el-icon-refresh" @click="resetFormClick">重置</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <self-table :columns="columns" :tableData="tableData" :page="page" :table-loading="tableLoading" v-on:pageSizeChange="pageSizeChange" v-on:pageNoChange="pageNoChange"></self-table>
      </el-main>
    </el-container>

</template>

<script>
  import FunResourceTree from './FunResourceTree.vue'
  import SelfPage from '@/components/SelfPage.vue'
  import SelfTable from '@/components/SelfTable.vue'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import OfficeTree from '@/views/office/OfficeTree.vue'
  import FunResourceInputSelect from '@/views/funResource/FunResourceInputSelect'
  export default {
    name: 'FunResource',
    components: {
      FunResourceInputSelect,
      OfficeTree,
      SelfDictSelect,
      SelfTable,
      FunResourceTree,
      SelfPage
    },
    data () {
      return {
        columns: [
          {
            name: 'icon',
            label: '图标',
            width: '50',
            html: this.iconFormatter
          },
          {
            name: 'name',
            label: '名称'
          },
          {
            name: 'type',
            label: '类型',
            dict: 'funResource_type'
          },
          {
            name: 'isShow',
            label: '是否显示',
            dict: 'yes_no'
          },
          {
            name: 'permissions',
            label: '权限标识'
          },
          {
            name: 'parentId',
            label: '父级',
            formatter: this.dataParentFormatter
          },
          {
            label: '操作',
            width: '300',
            buttons: [
              {
                label: '编辑',
                styleType: 'primary',
                icon: 'el-icon-edit',
                click: this.editTableRowClick
              },
              {
                label: '删除',
                styleType: 'danger',
                icon: 'el-icon-delete',
                click: this.deleteTableRowClick
              },
              {
                label: '强制删除',
                styleType: 'danger',
                icon: 'el-icon-delete',
                click: this.deleteForceTableRowClick
              }
            ]
          }
        ],
        page: {
          pageNo: 1,
          dataNum: 0
        },
        tableParent: {},
        // 表格数据
        tableData: [],
        tableLoading: false,
        // 搜索的查询条件
        searchFormModel: {
          name: '',
          type: '',
          isShow: '',
          parentId: '',
          dataOfficeId: '',
          includeParent: true,
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
        this.$refs.funResourceinput.setLabelName(data.name)
        this.searchFormModel.parentId = data.id
        this.searchBtnClick()
      },
      resetFormClick () {
        this.$refs.searchForm.resetFields()
        this.$refs.funResourceinput.setLabelName(null)
        this.searchFormModel.parentId = null
      },
      // 查询按钮点击事件
      searchBtnClick () {
        this.loadTableData(1)
      },
      // 加载表格数据
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
        this.$http.get('/base/functionResources', self.searchFormModel)
          .then(function (response) {
            let content = response.data.data.content
            self.tableParent = response.data.data.parent
            self.tableData = content
            self.page.dataNum = response.data.data.page.dataNum
            self.tableLoading = false
          })
          .catch(function (error) {
            if (error.response.status === 404) {
              self.tableData = []
              self.page.dataNum = 0
              self.tableParent = {}
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
        this.$router.push('/Main/FunResourceEdit/' + row.id)
      },
      // tablb 表格删除行
      deleteTableRowClick (index, row) {
        let self = this
        this.$confirm('确定要删除吗, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          self.$http.delete('/base/functionResource/' + row.id)
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
      // tablb 表格强制删除行
      deleteForceTableRowClick (index, row) {
        let self = this
        this.$confirm('确定要强制删除吗,当前节点及子孙节点都会被删除, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          self.$http.delete('/base/functionResource/' + row.id + '/force')
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
        this.$utils.loadDataControl.add('FunResourceAddLoadData=true')
        this.$router.push('/Main/FunResourceAdd')
      },
      dataParentFormatter (row) {
        let name = null
        if (this.tableParent && this.tableParent[row.parentId]) {
          name = this.tableParent[row.parentId].name || null
        }
        return name
      },
      iconFormatter (index, row) {
        if (row.icon) {
          return '<i class="' + row.icon + '"></i>'
        }
        return ''
      }
    },
    watch: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
