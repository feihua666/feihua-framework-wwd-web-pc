<template>
  <div class="index-aside-menu">
  <template v-for="item in menus">
    <template v-if="item.type === 'menu' && item.children && item.children.length > 0">
      <el-submenu :index="item.id"  :key="item.id">
        <template slot="title">
          <i :class="item.icon ? item.icon : 'el-icon-question'"></i>
          <span>{{generateName(item.name)}}</span>
        </template>
        <menu-item :menus="item.children"></menu-item>
      </el-submenu>
    </template>
    <template v-else>
      <a :href="item.path" target="_blank" v-if="item.type === 'link_page' && isStartHttp(item)" :key="item.id">
        <el-menu-item :index="item.path">
          <i :class="item.icon ? item.icon : 'el-icon-question'"></i>
          <span>{{generateName(item.name)}}</span>
        </el-menu-item>
      </a>
      <router-link v-else-if="item.type === 'link_page' || item.type === 'link'" :to="item.path" :key="item.id">
        <el-menu-item :index="item.path">
          <i :class="item.icon ? item.icon : 'el-icon-question'"></i>
          <span>{{generateName(item.name)}}</span>
        </el-menu-item>
      </router-link>
    </template>
  </template>
  </div>
</template>

<script>
  export default {
    name: 'MenuItem',
    props: {
      menus: {
        type: Array
      }
    },
    methods: {
      generateName (name) {
        return name
      },
      isStartHttp (menu) {
        return menu.path && menu.path.indexOf('http') === 0
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  a{
    text-decoration: none;
    cursor: pointer;
    color: inherit;
    text-decoration-line: none;
  }
  .el-submenu .el-menu-item {
    height: 34px;
    line-height: 34px;
  }
.glyphicon{
  margin-right: 5px;
  width: 24px;
  height: 18px;
  text-align: center;
}
  .glyphicon,.el-submenu [class^="el-icon-"],.el-menu-item [class^="el-icon-"]{
    color: #f2f2f2;
  }

  .el-menu--collapse  .el-menu-item span, .el-menu--collapse  .el-submenu  .el-submenu__title span {
    height: 0;
    width: 0;
    overflow: hidden;
    visibility: hidden;
    display: inline-block;
  }

</style>
<style>
  .index-aside-menu .el-menu-item, .index-aside-menu .el-submenu__title {
    height: 40px !important;
    line-height: 40px !important
  }

  .el-menu--collapse .index-aside-menu  .el-menu-item .el-submenu__icon-arrow,.el-menu--collapse .index-aside-menu   .el-submenu  .el-submenu__title .el-submenu__icon-arrow {
    display: none;
  }
</style>
