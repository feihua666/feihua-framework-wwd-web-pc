<template>
  <div class="fh-page-wrapper fh-el-collapse-item-head-bg">
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
    <el-collapse-item title="字典数据范围" name="dictDataScope">
      <DictDataScopeDefine :dataScopeId="dataScopeId"></DictDataScopeDefine>
    </el-collapse-item>
    <el-collapse-item title="职务数据范围" name="postJobDataScope">
      <PostJobDataScopeDefine :dataScopeId="dataScopeId"></PostJobDataScopeDefine>
    </el-collapse-item>
    <el-collapse-item title="岗位数据范围" name="postDataScope">
      <PostDataScopeDefine :dataScopeId="dataScopeId"></PostDataScopeDefine>
    </el-collapse-item>
    <el-collapse-item title="区域数据范围" name="areaDataScope">
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
  import PostDataScopeDefine from '@/views/postjob/PostDataScopeDefine.vue'
  import PostJobDataScopeDefine from '@/views/postjob/PostJobDataScopeDefine.vue'
  export default {
    name: 'DataScopeSetting',
    components: {
      UserDataScopeDefine,
      OfficeDataScopeDefine,
      RoleDataScopeDefine,
      DataScopeDataScopeDefine,
      DictDataScopeDefine,
      PostDataScopeDefine,
      PostJobDataScopeDefine
    },
    data () {
      return {
        activeNames: [
          'userDataScope',
          'officeDataScope',
          'roleDataScope',
          'dataScopeDataScope',
          'dictDataScope',
          'postJobDataScope',
          'postDataScope',
          'areaDataScope'
        ],
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
</style>
