<template>

  <div class="wrapper">
    <el-container>
      <el-header>
        <SiteSelect style="width:100%" v-model="searchFormModel.siteId"></SiteSelect>
      </el-header>
      <el-main>
        <el-collapse value="1">
          <el-collapse-item title="查询条件" name="1">
            <el-form ref="searchForm" :model="searchFormModel" :inline="true" size="small">
              <el-form-item label="标题">
                <el-input  v-model="searchFormModel.title"></el-input>
              </el-form-item>
              <el-form-item label="作者">
                <el-input  v-model="searchFormModel.author"></el-input>
              </el-form-item>
              <el-form-item label="状态">
                <SelfDictSelect  v-model="searchFormModel.status" type="cms_content_status"></SelfDictSelect>
              </el-form-item>
              <el-form-item label="栏目">
                <ChannelInputSelect ref="channelinput" :site-id="searchFormModel.siteId"  v-model="searchFormModel.channelId">
                </ChannelInputSelect>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchBtnClick">查询</el-button>
                <el-button type="primary" @click="addTableRowClick">添加</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <self-table :columns="columns" :tableData="tableData" :page="page" :table-loading="tableLoading" v-on:pageSizeChange="pageSizeChange" v-on:pageNoChange="pageNoChange"></self-table>
      </el-main>
    </el-container>
    <site-select-dialog ref="siteSelectDialog" :on-success="siteSelectSuccess"/>
  </div>
</template>

<script>
  import SelfPage from '@/components/SelfPage.vue'
  import SelfTable from '@/components/SelfTable.vue'
  import loadDataControl from '@/utils/storeLoadDataControlUtils.js'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import ChannelInputSelect from '@/views/cms/channel/ChannelInputSelect.vue'
  import SiteSelect from '@/views/cms/site/SiteSelect.vue'
  import SiteSelectDialog from '@/views/cms/site/SiteSelectDialog'

  export default {
    name: 'Content',
    components: {
      SelfDictSelect,
      SelfTable,
      SelfPage,
      ChannelInputSelect,
      SiteSelect,
      SiteSelectDialog
    },
    data () {
      return {
        columns: [
          {
            name: 'id',
            label: '内容id',
            width: '250'
          },
          {
            name: 'title',
            label: '标题'
          },
          {
            name: 'author',
            label: '作者'
          },
          {
            name: 'status',
            label: '状态',
            dict: 'cms_content_status'
          },
          {
            name: 'contentType',
            label: '内容分类',
            dict: 'cms_content_type',
            dictValue: true
          },
          {
            name: 'siteId',
            label: '站点',
            formatter: this.dataSiteFormatter
          },
          {
            name: 'channelId',
            label: '栏目',
            formatter: this.dataChannelFormatter
          },
          {
            label: '操作',
            width: '150',
            buttons: [
              {
                label: '预览',
                click: this.viewIndexAddress
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
          dataNum: 0
        },
        tableSite: {},
        tableChannel: {},
        // 表格数据
        tableData: [],
        tableLoading: false,
        // 搜索的查询条件
        searchFormModel: {
          title: null,
          author: null,
          status: null,
          siteId: null,
          channelId: null,
          content: null,
          includeSite: true,
          includeChannel: true,
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
      // 查询按钮点击事件
      searchBtnClick () {
        this.loadTableData(1)
      },
      // 加载表格数据
      loadTableData (pageNo) {
        let self = this
        // 如果不存在 siteId 弹窗选择site
        if (!this.searchFormModel.siteId) {
          this.$refs.siteSelectDialog.show()
          return
        }
        if (pageNo) {
          self.searchFormModel.pageNo = pageNo
        }
        self.tableLoading = true
        this.$http.get('/cms/contents', self.searchFormModel)
          .then(function (response) {
            let content = response.data.data.content
            self.tableSite = response.data.data.site
            self.tableChannel = response.data.data.channel
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
        this.loadTableData(val)
      },
      // tablb 表格编辑行
      editTableRowClick (index, row) {
        this.$router.push('/Main/Cms/ContentEdit/' + row.id)
      },
      // tablb 表格删除行
      deleteTableRowClick (index, row) {
        let self = this
        this.$confirm('确定要删除吗, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          this.$http.delete('/cms/content/' + row.id)
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
        loadDataControl.add(this.$store, 'ContentAddLoadData=true')
        let url = '/Main/Cms/ContentAdd?siteId=' + (this.searchFormModel.siteId || '')
        if (this.searchFormModel.channelId) {
          url = url + '&channelId=' + this.searchFormModel.channelId
        }
        this.$router.push(url)
      },
      dataSiteFormatter (row) {
        let name = null
        if (this.tableSite && this.tableSite[row.siteId]) {
          name = this.tableSite[row.siteId].name || null
        }
        return name
      },
      dataChannelFormatter (row) {
        let name = null
        if (this.tableChannel && this.tableChannel[row.channelId]) {
          name = this.tableChannel[row.channelId].name || null
        }
        return name
      },
      siteSelectSuccess (siteId) {
        this.searchFormModel.siteId = siteId
      },
      setChannelId (channelId) {
        this.searchFormModel.channelId = channelId
        this.$refs.channelinput.initLabelName(channelId)
      },
      viewIndexAddress (index, row) {
        let self = this
        this.$http.get('/cms/content/' + row.id + '/address')
          .then(function (response) {
            let site = response.data.data.content
            let channel = response.data.data.channel
            let content = response.data.data.contentc
            let url = site.sitePath + channel.channelPath + content.contentUrl
            self.$alert('<a href="' + url + '" target="_blank">' + url + '</a>', '内容地址', {
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
        if (vm.$route.query.channelId) {
          vm.setChannelId(vm.$route.query.channelId)
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
