<template>
  <el-container  class="fh-page-wrapper">
    <el-aside width="200px" class="fh-tree-aside">
      <el-scrollbar style="height: 100%;" wrapStyle="height:100%;overflow:auto;" >
        <PostTree ref="lefttree" style="width: 200px;" v-on:nodeClick="treeNodeClick"></PostTree>
      </el-scrollbar>
    </el-aside>
    <el-main>
      <el-collapse value="1">
        <el-collapse-item title="查询条件" name="1">
          <el-form ref="searchForm" :model="searchFormModel" :inline="true" size="small">
            <el-form-item label="岗位名称" prop="name">
              <el-input v-model="searchFormModel.name"></el-input>
            </el-form-item>
            <el-form-item label="岗位编码" prop="code">
              <el-input v-model="searchFormModel.code"></el-input>
            </el-form-item>
            <el-form-item label="岗位类型" prop="type">
              <SelfDictSelect v-model="searchFormModel.type" type="post_type"></SelfDictSelect>
            </el-form-item>
            <el-form-item label="岗位职务" prop="postJobId">
              <el-input v-model="searchFormModel.postJobId"></el-input>
            </el-form-item>
            <el-form-item label="是否禁用" prop="disabled">
              <SelfDictSelect v-model="searchFormModel.disabled" type="yes_no"></SelfDictSelect>
            </el-form-item>
            <el-form-item label="父级" prop="parentId">
              <PostInputSelect ref="postinput"  v-model="searchFormModel.parentId">
              </PostInputSelect>
            </el-form-item>
            <el-form-item label="归属机构" prop="dataOfficeId">
              <OfficeInputSelect ref="officeinput"  v-model="searchFormModel.dataOfficeId">
              </OfficeInputSelect>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" icon="el-icon-search" :loading="tableLoading" @click="searchBtnClick">查询</el-button>
              <el-button type="primary" icon="el-icon-plus" @click="addTableRowClick">添加</el-button>
              <el-button type="warning" icon="el-icon-refresh" @click="resetFormClick">重置</el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
      <self-table :columns="columns" :tableData="tableData" :page="page" :table-loading="tableLoading"
                  v-on:pageSizeChange="pageSizeChange" v-on:pageNoChange="pageNoChange"></self-table>
    </el-main>
  </el-container>

</template>

<script>
  import PostTree from './PostTree.vue'
  import SelfPage from '@/components/SelfPage.vue'
  import SelfTable from '@/components/SelfTable.vue'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import OfficeInputSelect from '@/views/office/OfficeInputSelect'
  import PostInputSelect from '@/views/postjob/PostInputSelect.vue'
  export default {
    name: 'Post',
    components: {
      SelfDictSelect,
      SelfTable,
      PostTree,
      PostInputSelect,
      OfficeInputSelect,
      SelfPage
    },
    data () {
      return {
        columns: [
          {
            name: 'name',
            label: '岗位名称'
          },
          {
            name: 'code',
            label: '岗位编码'
          },
          {
            name: 'type',
            label: '岗位类型',
            dict: 'post_type'
          },
          {
            name: 'postJobId',
            label: '岗位职务',
            formatter: this.dataPostJobFormatter
          },
          {
            name: 'disabled',
            label: '是否禁用',
            dict: 'yes_no'
          },
          {
            name: 'isPublic',
            label: '是否公共',
            dict: 'yes_no'
          },
          {
            name: 'parentId',
            label: '父级',
            formatter: this.dataParentFormatter
          },
          {
            name: 'dataOfficeId',
            label: '归属机构',
            formatter: this.dataOfficeFormatter
          },
          {
            label: '操作',
            dropdown: true,
            buttons: [
              {
                label: '编辑',
                styleType: 'primary',
                icon: 'el-icon-edit',
                click: this.editTableRowClick
              },
              {
                label: '分配角色',
                styleType: 'primary',
                icon: 'el-icon-setting',
                click: this.postBindRolesBtnClick
              },
              {
                label: '删除',
                styleType: 'danger',
                icon: 'el-icon-delete',
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
        // 表格数据
        tableData: [],
        tableLoading: false,
        // 搜索的查询条件
        searchFormModel: {
          name: '',
          code: '',
          type: '',
          postJobId: '',
          disabled: '',
          parentId: '',
          dataOfficeId: '',
          includeOffice: true,
          includeParent: true,
          includePostJob: true,
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
        this.$refs.postinput.setLabelName(data.name)
        this.searchFormModel.parentId = data.id
        this.searchBtnClick()
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
        this.$http.get('/base/postjob/posts', self.searchFormModel)
          .then(function (response) {
            let content = response.data.data.content
            self.tableData = content
            self.tableOffice = response.data.data.office
            self.tableParent = response.data.data.parent
            self.page.dataNum = response.data.data.page.dataNum
            self.tableLoading = false
          })
          .catch(function (error) {
            if (error.response.status === 404) {
              self.tableData = []
              self.page.dataNum = 0
              self.tableOffice = {}
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
        this.$utils.loadDataControl.add('PostEditLoadData=true')
        this.$router.push('/Main/PostEdit/' + row.id)
      },
      // tablb 表格删除行
      deleteTableRowClick (index, row) {
        let self = this
        this.$confirm('确定要删除吗, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          this.$http.delete('/base/postjob/post/' + row.id)
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
        this.$utils.loadDataControl.add('PostAddLoadData=true')
        this.$router.push('/Main/PostAdd')
      },
      resetFormClick () {
        this.$refs.searchForm.resetFields()
        this.$refs.officeinput.setLabelName(null)
        this.$refs.postinput.setLabelName(null)
        this.searchFormModel.parentId = null
        this.searchFormModel.dataOfficeId = null
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
      dataPostJobFormatter (row) {
        let name = null
        if (this.postJob && this.postJob[row.postJobId]) {
          name = this.postJob[row.postJobId].name || null
        }
        return name
      },
      // 岗位绑定角色
      postBindRolesBtnClick (index, row) {
        this.$utils.loadDataControl.add('PostBindRolesLoadData=true')
        this.$router.push('/Main/PostBindRoles/' + row.id)
      }
    },
    watch: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
