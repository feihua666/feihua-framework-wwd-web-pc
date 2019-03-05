<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="30%">
    <template v-for="first in firstMenu"  >
      <el-dropdown placement="top-end" :key="first.id" style="margin: auto 10px;">

          <span class="el-dropdown-link">
            {{first.name}}<i  v-if="getChildren(first.id)" class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" v-if="getChildren(first.id)">
            <el-dropdown-item v-for="second in getChildren(first.id)" :key="second.id">{{second.name}}</el-dropdown-item>
          </el-dropdown-menu>
      </el-dropdown>

  </template>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
  </span>
  </el-dialog>
</template>

<script>
  export default {
    name: 'WeixinMenuPreviewDialog',
    components: {
    },
    props: {
      // 弹窗标题
      title: {
        default: '预览'
      },
      which: null
    },
    data () {
      return {
        dialogVisible: false,
        treeLoading: false,
        treeData: [],
        param: {
          orderable: true,
          orderby: 'sequence-asc'
        },
        firstMenuLength: 3,
        secondtMenuLength: 5
      }
    },
    mounted () {
    },
    computed: {
      firstMenu () {
        let _menus = []
        if (this.treeData) {
          this.treeData.forEach((item) => {
            if (item.level === 1 && _menus.length < this.firstMenuLength) {
              if (item.type || this.getChildren(item.id)) {
                _menus.push(item)
              }
            }
          })
        }
        console.log(_menus)
        return _menus
      },
      secondMenu () {
        let _menus = []
        if (this.treeData) {
          this.treeData.forEach((item) => {
            if (item.level === 2 && _menus.length < this.secondtMenuLength && item.type) {
              _menus.push(item)
            }
          })
        }
        return _menus
      }
    },
    methods: {
      // 加载树数据
      loadTreeData () {
        let self = this
        if (!this.which) {
          self.treeData = []
          return
        }
        self.treeLoading = true
        this.$http.get('/weixinmenu/menus', this.param)
          .then(function (response) {
            let content = response.data.data.content
            self.treeData = content
            self.treeLoading = false
          })
          .catch(function (error) {
            if (error.response.status === 404) {
              self.treeData = []
            }
            self.treeLoading = false
          })
      },
      getChildren (parentId) {
        let _menus = []
        if (this.secondMenu) {
          this.secondMenu.forEach((item) => {
            if (item.parentId === parentId) {
              _menus.push(item)
            }
          })
        }
        return _menus
      },
      show () {
        this.loadTreeData()
        this.dialogVisible = true
      },
      hide () {
        this.dialogVisible = false
      }
    },
    watch: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

