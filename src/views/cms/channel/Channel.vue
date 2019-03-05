<template>

  <div class="wrapper">

    <el-container>
      <el-header>
        <SiteSelect style="width:100%" v-model="searchFormModel.siteId"></SiteSelect>
      </el-header>
      <el-container>
      <el-aside width="200px">
        <el-scrollbar style="height: 100%;" wrapStyle="height:100%;overflow:auto;" >
          <ChannelTree :site-id="searchFormModel.siteId" ref="lefttree" v-on:nodeClick="treeNodeClick"></ChannelTree>
         </el-scrollbar>
      </el-aside>
      <el-main>
        <el-collapse value="1">
          <el-collapse-item title="查询条件" name="1">
            <el-form ref="searchForm" :model="searchFormModel" :inline="true" size="small">
              <el-form-item label="名称">
                <el-input  v-model="searchFormModel.name"></el-input>
              </el-form-item>
              <el-form-item label="父级">
                <ChannelInputSelect ref="channelinput" :site-id="searchFormModel.siteId"  v-model="searchFormModel.parentId">
                </ChannelInputSelect>
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
    </el-container>

    <site-select-dialog ref="siteSelectDialog" :on-success="siteSelectSuccess"/>
  </div>
</template>

<script>
  import ChannelTree from './ChannelTree.vue'
  import SelfPage from '@/components/SelfPage.vue'
  import SelfTable from '@/components/SelfTable.vue'
  import loadDataControl from '@/utils/storeLoadDataControlUtils.js'
  import ChannelInputSelect from '@/views/cms/channel/ChannelInputSelect.vue'
  import SiteSelect from '@/views/cms/site/SiteSelect.vue'
  import SiteSelectDialog from '@/views/cms/site/SiteSelectDialog'
  export default {
    name: 'Channel',
    components: {
      SiteSelectDialog,
      SiteSelect,
      SelfTable,
      ChannelTree,
      SelfPage,
      ChannelInputSelect
    },
    data () {
      return {
        columns: [
          {
            name: 'id',
            label: '栏目id',
            width: '250'
          },
          {
            name: 'name',
            label: '名称'
          },
          {
            name: 'path',
            label: '路径'
          },
          {
            name: 'sequence',
            label: '排序'
          },
          {
            name: 'channelType',
            label: '栏目分类',
            dict: 'cms_channel_type',
            dictValue: true
          },
          {
            name: 'parentId',
            label: '父级',
            formatter: this.dataParentFormatter
          },
          {
            name: 'siteId',
            label: '站点',
            formatter: this.dataSiteFormatter
          },
          {
            label: '操作',
            width: '200',
            buttons: [
              {
                label: '预览',
                click: this.viewIndexAddress
              },
              {
                label: '内容管理',
                click: this.jumpToContent
              },
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
        tableSite: {},
        tableParent: {},
        // 表格数据
        tableData: [],
        tableLoading: false,
        // 搜索的查询条件
        searchFormModel: {
          name: null,
          parentId: null,
          siteId: null,
          includeParent: true,
          includeSite: true,
          pageable: true,
          pageNo: 1,
          pageSize: 10
        }
      }
    },
    mounted () {
      if (this.searchFormModel.siteId) {
        this.loadTableData(1)
      }
    },
    methods: {
      // 点击树节点事件
      treeNodeClick (data) {
        this.$refs.channelinput.setLabelName(data.name)
        this.searchFormModel.parentId = data.id
        this.searchBtnClick()
      },
      resetFormClick () {
        this.$refs.searchForm.resetFields()
        this.$refs.channelinput.setLabelName(null)
        this.searchFormModel.parentId = null
      },
      // 查询按钮点击事件
      searchBtnClick () {
        this.loadTableData(1)
      },
      // 加载表格数据
      loadTableData (pageNo, pageNoChange) {
        // 如果不存在 siteId 弹窗选择site
        if (!this.searchFormModel.siteId) {
          this.$refs.siteSelectDialog.show()
          return
        }
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
        this.$http.get('/cms/channels', self.searchFormModel)
          .then(function (response) {
            let content = response.data.data.content
            self.tableSite = response.data.data.site
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
        this.$router.push('/Main/Cms/ChannelEdit/' + row.id)
      },
      // tablb 表格删除行
      deleteTableRowClick (index, row) {
        let self = this
        this.$confirm('确定要删除吗, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          this.$http.delete('/cms/channel/' + row.id)
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
        loadDataControl.add(this.$store, 'ChannelAddLoadData=true')
        this.$router.push('/Main/Cms/ChannelAdd?siteId=' + this.searchFormModel.siteId)
      },
      dataParentFormatter (row) {
        let name = null
        if (this.tableParent && this.tableParent[row.parentId]) {
          name = this.tableParent[row.parentId].name || null
        }
        return name
      },
      dataSiteFormatter (row) {
        let name = null
        if (this.tableSite && this.tableSite[row.siteId]) {
          name = this.tableSite[row.siteId].name || null
        }
        return name
      },
      siteSelectSuccess (siteId) {
        this.searchFormModel.siteId = siteId
      },
      jumpToContent (index, row) {
        this.$router.push('/Main/Cms/Content?siteId=' + row.siteId + '&channelId=' + row.id)
      },
      viewIndexAddress (index, row) {
        let self = this
        this.$http.get('/cms/channel/' + row.id + '/address')
          .then(function (response) {
            let site = response.data.data.content
            let channel = response.data.data.channel
            let url = site.sitePath + channel.channelUrl
            self.$alert('<a href="' + url + '" target="_blank">' + url + '</a>', '栏目首页地址', {
              confirmButtonText: '关闭',
              dangerouslyUseHTMLString: true
            })
          })
      }
    },
    watch: {
      'searchFormModel.siteId' () {
        this.loadTableData(1)
      }
    },
    // tab切换如果参数不一样，重新加载数据
    beforeRouteEnter  (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        if (!vm.searchFormModel.siteId && !vm.$route.query.siteId) {
          vm.loadTableData(1)
        } else if (vm.searchFormModel.siteId !== vm.$route.query.siteId && vm.$route.query.siteId) {
          vm.searchFormModel.siteId = vm.$route.query.siteId
          vm.loadTableData(1)
        }
      })
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
