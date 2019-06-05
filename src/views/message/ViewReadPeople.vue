<template>
  <el-container  class="fh-page-wrapper">
      <el-main>
        <el-collapse value="1">
          <el-collapse-item title="查询条件" name="1">
            <el-form ref="searchForm" :model="searchFormModel" :inline="true" size="small">
              <el-form-item label="是否已读">
                <self-dict-select v-model="searchFormModel.isRead" type="yes_no"></self-dict-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="searchBtnClick">查询</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <self-table :columns="columns" :tableData="realTableData" :page="page" :table-loading="tableLoading" v-on:pageSizeChange="pageSizeChange" v-on:pageNoChange="pageNoChange"></self-table>
      </el-main>
    </el-container>

</template>

<script>
  import SelfPage from '@/components/SelfPage.vue'
  import SelfTable from '@/components/SelfTable.vue'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  export default {
    name: 'ViewReadPeople',
    components: {
      SelfDictSelect,
      SelfTable,
      SelfPage
    },
    data () {
      return {
        // 消息id
        id: null,
        columns: [
          {
            name: 'nickname',
            label: '用户名'
          },
          {
            name: 'isRead',
            label: '是否已读',
            dict: 'yes_no'
          },
          {
            name: 'readTime',
            label: '读取时间'
          },
          {
            name: 'readClientName',
            label: '读取客户端'
          }
        ],
        page: {
          dataNum: 0
        },
        // 表格数据
        tableData: [],
        users: [],
        clients: [],
        tableLoading: false,
        // 搜索的查询条件
        searchFormModel: {
          isRead: null,
          pageable: true,
          pageNo: 1,
          pageSize: 10
        }
      }
    },
    mounted () {
      this.loadTableData(1)
    },
    computed: {
      realTableData () {
        let realTableData = []
        if (this.tableData) {
          let length = this.tableData.length
          for (let i = 0; i < length; i++) {
            let tableItem = this.tableData[i]
            let userItem = this.uersMap[tableItem.userId]
            let clientItem = this.clientMap[tableItem.readClientId]
            console.log(clientItem)
            realTableData.push({
              nickname: userItem ? userItem.nickname : null,
              isRead: this.tableData[i].isRead,
              readTime: this.tableData[i].readTime,
              readClientName: clientItem ? clientItem.clientName : null
            })
          }
        }
        return realTableData
      },
      uersMap () {
        let r = {}
        if (this.users) {
          let length = this.users.length
          for (let i = 0; i < length; i++) {
            r[this.users[i].id] = this.users[i]
          }
        }
        return r
      },
      clientMap () {
        let r = {}
        if (this.clients) {
          let length = this.clients.length
          for (let i = 0; i < length; i++) {
            r[this.clients[i].id] = this.clients[i]
          }
        }
        return r
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
        if (!self.id) {
          return
        }
        if (pageNo) {
          self.searchFormModel.pageNo = pageNo
        }
        self.tableLoading = true
        this.$http.get('/base/message/' + self.id + '/viewReadPeople', self.searchFormModel)
          .then(function (response) {
            let content = response.data.data.content
            let users = response.data.data.users
            let clients = response.data.data.clients
            self.tableData = content
            self.users = users
            self.clients = clients
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
      }
    },
    watch: {
    },
    // tab切换如果参数不一样，重新加载数据
    beforeRouteEnter  (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        if (vm.id !== vm.$route.params.id) {
          vm.id = vm.$route.params.id
          vm.loadTableData()
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
