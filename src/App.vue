<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
  export default {
    name: 'app'
  }
</script>
<style>
  html,body,#app{
    height:100% !important;
    margin: 0;
    padding: 0;
  }
  html {
    font-size: 100% !important;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  /* 自定义通用 */
  .fh-background-white{
    background-color: #fff;
  }
  .fh-page-wrapper{
    height:100%;
    overflow: auto;
  }
  .el-select__input {

    vertical-align: baseline;

  }
  .fh-page-wrapper .el-main{
    padding:3px;
    overflow: auto;
  }
  .fh-padding-30{
    padding: 30px;
  }

  /* 折叠面析 */
  .el-collapse-item__arrow {
    /* 由于用了rotate 这个东西不是个正方形所以改变角度的时候会出现滚动条 */
    margin-right: 20px;
  }
  .el-collapse-item__content{
    padding-bottom: 0px;
  }
  .el-collapse-item__header,.el-collapse-item__content{
    padding: 0 10px;
  }

  /* 带有树的查询页左侧树 */
  .fh-tree-aside{
    background-color: #fff;
    border-right: 1px solid #e6ebf5;
  }
  .fh-tree-aside-panel{
    width: 200px;
  }

  /* 按钮bootstrap图标 */
  .el-button [class*=glyphicon]+span{
    margin-left: 5px;
  }
</style>
