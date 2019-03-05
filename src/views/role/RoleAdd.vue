<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" :rules="formRules" style="width: 460px;" label-width="100px">
      <el-form-item label="名称" prop="name" required>
        <el-input  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input  v-model="form.code"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <self-dict-select v-model="form.type" type="role_type"></self-dict-select>
      </el-form-item>
      <el-form-item label="是否禁用" prop="disabled" required>
        <self-dict-select v-model="form.disabled" type="yes_no"></self-dict-select>
      </el-form-item>
      <el-form-item label="机构">
        <OfficeInputSelect ref="officeinput"  v-model="form.dataOfficeId">
        </OfficeInputSelect>
      </el-form-item>
      <el-form-item label="父级" prop="parentId">
        <RoleInputSelect ref="roleinput"  v-model="form.parentId">
        </RoleInputSelect>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addBtnClick" :loading="addLoading">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import RoleTree from './RoleTree.vue'
  import loadDataControl from '@/utils/storeLoadDataControlUtils.js'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import OfficeInputSelect from '@/views/office/OfficeInputSelect'
  import RoleInputSelect from '@/views/role/RoleInputSelect.vue'
  export default {
    components: {
      RoleTree,
      OfficeInputSelect,
      RoleInputSelect,
      SelfDictSelect},
    name: 'RoleAdd',
    data () {
      return {
        form: {
          code: null,
          name: null,
          type: null,
          disabled: null,
          dataOfficeId: null,
          parentId: '0'
        },
        addLoading: false,
        formRules: {
          name: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          disabled: [
            {required: true, message: '必填', trigger: 'blur'}
          ]
        }
      }
    },
    mounted () {
    },
    methods: {
      addBtnClick () {
        let self = this
        if (self.addLoading === false) {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              // 请求添加
              self.addLoading = true
              self.$http.post('/base/role', self.form)
                .then(function (response) {
                  self.$message.info('角色添加成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  if (response.response.status === 409) {
                    self.$message.error('字典修改失败，编码已存在')
                  } else {
                    self.$message.error('角色添加失败，请稍后再试')
                  }
                  self.addLoading = false
                })
            } else {
              return false
            }
          })
        } else {
          self.$message.info('正在请求中，请耐心等待')
        }
      },
      resetForm () {
        this.$refs['form'].resetFields()
        this.$refs.officeinput.setLabelName(null)
        this.$refs.roleinput.setLabelName(null)
      }
    },
    watch: {
    },
    beforeRouteEnter  (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        let dataControl = 'RoleAddLoadData=true'
        if (loadDataControl.has(vm.$store, dataControl)) {
          // 重置表单
          vm.resetForm()
          loadDataControl.remove(vm.$store, dataControl)
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrapper{
  padding:1.5rem;
}
</style>
