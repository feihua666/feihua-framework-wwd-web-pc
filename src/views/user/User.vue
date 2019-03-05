<template>

  <div class="wrapper">
    <el-container>
      <el-aside width="200px">
        <el-scrollbar style="height: 100%;" wrapStyle="height:100%;overflow:auto;" >
          <office-tree  v-on:nodeClick="treeNodeClick"></office-tree>
         </el-scrollbar>
      </el-aside>
      <el-main>
        <el-collapse value="1">
          <el-collapse-item title="查询条件" name="1">

            <el-form ref="searchform" :model="searchFormModel" :inline="true" size="small">
              <el-form-item label="姓名" prop="nickname">
                <el-input  v-model="searchFormModel.nickname"></el-input>
              </el-form-item>
              <el-form-item label="是否锁定" prop="locked">
                <self-dict-select v-model="searchFormModel.locked" type="yes_no"></self-dict-select>
              </el-form-item>
              <el-form-item label="机构">
                <OfficeInputSelect ref="officeinput"  v-model="searchFormModel.dataOfficeId">
                </OfficeInputSelect>
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
  import SelfPage from '@/components/SelfPage.vue'
  import SelfTable from '@/components/SelfTable.vue'
  import loadDataControl from '@/utils/storeLoadDataControlUtils.js'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import OfficeTree from '@/views/office/OfficeTree.vue'
  import OfficeInputSelect from '@/views/office/OfficeInputSelect'
  export default {
    name: 'User',
    components: {
      OfficeTree,
      SelfDictSelect,
      SelfTable,
      SelfPage,
      OfficeInputSelect
    },
    data () {
      return {
        columns: [
          {
            name: 'photo',
            label: '头像',
            width: '50',
            html: this.photoFormatter,
            buttons: [
              {
                click: this.imageHeaderClick
              }
            ]
          },
          {
            name: 'nickname',
            label: '姓名'
          },
          {
            name: 'account',
            label: '帐号'
          },
          {
            name: 'mobile',
            label: '手机'
          },
          {
            name: 'gender',
            label: '性别',
            dict: 'gender'
          },
          {
            name: 'dataOfficeName',
            label: '机构'
          },
          {
            name: 'locked',
            label: '是否锁定',
            dict: 'yes_no'
          },
          {
            label: '操作',
            width: '270',
            buttons: [
              {
                label: '编辑',
                click: this.editTableRowClick
              },
              {
                label: '绑定角色',
                click: this.userBindRolesBtnClick
              },
              {
                label: '绑定数据范围',
                click: this.bindDataScope
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
        // 表格数据
        tableData: [],
        tableLoading: false,
        // 搜索的查询条件
        searchFormModel: {
          locked: '',
          dataOfficeId: '',
          nickname: '',
          includeOfficeName: true,
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
        this.$refs.officeinput.setLabelName(data.name)
        this.searchFormModel.dataOfficeId = data.id
        this.searchBtnClick()
      },
      resetFormClick () {
        this.$refs.searchform.resetFields()
        this.$refs.officeinput.setLabelName(null)
        this.searchFormModel.dataOfficeId = null
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
        this.$http.get('/base/users', self.searchFormModel)
          .then(function (response) {
            let content = response.data.data.content
            self.tableData = content
            self.page.dataNum = response.data.data.page.dataNum
            self.tableLoading = false
          })
          .catch(function (error) {
            if (error.response.status === 404) {
              self.tableData = []
              self.page.dataNum = 0
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
        this.$router.push('/Main/UserEdit/' + row.id)
      },
      // tablb 表格删除行
      deleteTableRowClick (index, row) {
        let self = this
        this.$confirm('确定要删除吗, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          this.$http.delete('/base/user/' + row.id)
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
        loadDataControl.add(this.$store, 'UserAddLoadData=true')
        this.$router.push('/Main/UserAdd')
      },
      // 用户绑定角色
      userBindRolesBtnClick (index, row) {
        this.$router.push('/Main/UserBindRoles/' + row.id)
      },
      bindDataScope (index, row) {
        this.$router.push('/Main/UserBindDataScope/' + row.id)
      },
      photoFormatter (row) {
        let url = null
        if (row.photo) {
          if (row.photo.indexOf('http') === 0) {
            url = row.photo
          } else {
            url = this.$config.file.getDownloadUrl(row.photo)
          }
        } else {
          url = require('@/assets/index/headPic.jpg')
        }
        return '<img width="30px" src="' + url + '"/>'
      },
      imageHeaderClick (index, row) {
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
