<template>
  <div class="wrapper">
  <el-collapse v-model="activeNames">
    <el-collapse-item title="机构数据范围" name="officeDataScope">
      <OfficeDataScopeDefine :dataScopeId="dataScopeId"></OfficeDataScopeDefine>
    </el-collapse-item>
    <el-collapse-item title="角色数据范围" name="roleDataScope">
      <RoleDataScopeDefine :dataScopeId="dataScopeId"></RoleDataScopeDefine>
    </el-collapse-item>
    <el-collapse-item title="用户数据范围" name="userDataScope">
      <UserDataScopeDefine :dataScopeId="dataScopeId"></UserDataScopeDefine>
    </el-collapse-item>
    <el-collapse-item title="数据范围的数据范围" name="dataScopeDataScope">
      <DataScopeDataScopeDefine :dataScopeId="dataScopeId"></DataScopeDataScopeDefine>
    </el-collapse-item>
    <el-collapse-item title="字典数据范围" name="userDataScope">
      公共资源，字典管理功能默认全部数据，但根据类型查询字典下拉选项接口根据这里设置，设置为按角色，可以实现跨部门机构或区域管理，否则设置为按用户
      <DictDataScopeDefine :dataScopeId="dataScopeId"></DictDataScopeDefine>
    </el-collapse-item>
    <el-collapse-item title="区域数据范围">
      公共资源，默认全部数据
    </el-collapse-item>

  </el-collapse>
  </div>
</template>

<script>
  // 在这里引入新组件
  import UserDataScopeDefine from '@/views/user/UserDataScopeDefine.vue'
  import OfficeDataScopeDefine from '@/views/office/OfficeDataScopeDefine.vue'
  import RoleDataScopeDefine from '@/views/role/RoleDataScopeDefine.vue'
  import DataScopeDataScopeDefine from '@/views/dataScope/DataScopeDataScopeDefine.vue'
  import DictDataScopeDefine from '@/views/dict/DictDataScopeDefine.vue'
  export default {
    name: 'DataScopeSetting',
    components: { UserDataScopeDefine, OfficeDataScopeDefine, RoleDataScopeDefine, DataScopeDataScopeDefine, DictDataScopeDefine },
    data () {
      return {
        activeNames: ['userDataScope', 'officeDataScope', 'roleDataScope', 'dataScopeDataScope'],
        dataScopeId: null // 数据范围id，页面传来的
      }
    },
    mounted () {
    },
    methods: {
    },
    watch: {
    },
    // tab切换如果参数不一样，重新加载数据
    beforeRouteEnter  (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        if (vm.dataScopeId !== vm.$route.params.id) {
          vm.dataScopeId = vm.$route.params.id
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrapper{
  height: 100%;
  overflow: auto;
}
</style>
<style>
  .el-collapse-item__arrow {
    /* 由于用了rotate 这个东西不是个正方形所以改变角度的时候会出现滚动条 */
    margin-right: 20px;
  }
</style>
