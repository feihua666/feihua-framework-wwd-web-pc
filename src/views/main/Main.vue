<template>
  <el-container>
    <el-aside :width="leftAsideWidth" style="background-color:#304156;overflow-x: hidden;transition: width 500ms;">
      <el-container>
        <el-header style="padding: 0.4rem;color: #fff">
          <profile :is-collapse="isCollapse"></profile>
        </el-header>
        <el-main>
          <el-scrollbar class="self-scroll-bar-view" wrapStyle="overflow:auto;">
          <el-menu mode="vertical" :default-openeds="defaultOpeneds" class="el-menu-vertical-demo"
                   v-loading="menuLoading" :collapse="isCollapse"  v-on:open="handleOpen" v-on:close="handleClose"
                   element-loading-background="rgb(48, 65, 86)"
                   :default-active="decodeURIComponent($route.fullPath)" background-color="#304156" text-color="#fff" active-text-color="#409EFF">
            <menu-items :menus="menus"></menu-items>
          </el-menu>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-aside>
    <el-main>
    <el-container style="overflow: hidden;">
      <el-header style="padding: 0;" height="34">
        <visited-views :menus="menus" :is-collapse="isCollapse" v-on:collapseLeftMenu="collapseLeftMenu"></visited-views>
      </el-header>
      <el-main style="overflow: hidden;">
        <transition name="slide-left">
        <router-view style=" transition: all .3s ease;" v-if="$route.meta.keepAlive === false"></router-view>
        <keep-alive>
          <router-view style=" transition: all .3s ease;"  v-if="$route.meta.keepAlive === true || $route.meta.keepAlive === undefined"></router-view>
        </keep-alive>
        </transition>
      </el-main>
    </el-container>
    </el-main>
  </el-container>
</template>
<script>
  import { arrayToTree } from '@/utils/treeUtils.js'
  import MenuItems from './MenuItem.vue'
  import Profile from './Profile.vue'
  import VisitedViews from './VisitedViews.vue'
  export default {
    components: {
      VisitedViews, MenuItems, Profile },
    name: 'Main',
    data () {
      return {
        leftAsideWidth: '200px',
        isCollapse: false,
        defaultOpeneds: [],
        collapse: true,
        menuLoading: false,
        menus: []
      }
    },
    created () {
      this.loadUserInfo()
      this.loadMenus()
    },
    watch: {
      isCollapse (val) {
        this.leftAsideWidth = val === false ? '200px' : '64px'
      }
    },
    methods: {
      collapseLeftMenu (isCollapse) {
        this.isCollapse = isCollapse
      },
      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath)
      },
      loadMenus () {
        let self = this
        self.menuLoading = true
        this.$http.get('/base/functionResources', {isShow: 'Y'})
          .then(function (response) {
            let content = response.data.data.content
            if (content) {
              let menus = []
              for (let obj in content) {
                content[obj].path = content[obj].url
                menus.push(content[obj])
              }
              self.menus = arrayToTree(menus)
              // 默认展开
              for (let item in self.menus) {
                if (self.menus[item].level === 1) {
                  self.defaultOpeneds.push(self.menus[item].id)
                }
              }
            }
            self.menuLoading = false
          }).catch(error => {
            if (error.response) {
            }
            self.menuLoading = false
          })
      },
      loadUserInfo () {
        let self = this
        self.$http.get('/base/user/current')
          .then(response => {
            let content = response.data.data.content
            if (content) {
              self.$store.commit('setLoginUser', content)
            } else {
              self.$router.push({name: 'Login'})
            }
          }).catch(function (response) {
            if (response.response.status === 401) {
              self.$router.push({name: 'Login'})
            } else {
              self.msg = '抱歉系统好像出问题了'
            }
          })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-container{
  height:100%;
}
.el-main{
  padding:0;
  height: 100%;
}
.el-menu{
  border-right:0;
}
.self-scroll-bar-view{
  height:100%;
}

.slide-left-leave-active{
  opacity: 0;
}

.slide-left-enter-active{
  opacity: 0;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
<style>
  /*.self-scroll-bar-view */.el-scrollbar__view{
    overflow: hidden;
  }
</style>
