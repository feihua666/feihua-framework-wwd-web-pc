<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" :rules="formRules" style="width: 460px;" label-width="100px" v-loading="formDataLoading">
      <el-form-item label="名称" prop="name">
        <el-input  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input  v-model="form.code"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <self-dict-select v-model="form.type" type="role_type"></self-dict-select>
      </el-form-item>
      <el-form-item label="是否禁用" prop="disabled">
        <self-dict-select v-model="form.disabled" type="yes_no"></self-dict-select>
      </el-form-item>
      <el-form-item label="机构">
        <OfficeInputSelect ref="officeinput"  v-model="form.dataOfficeId">
        </OfficeInputSelect>
      </el-form-item>
      <el-form-item label="父级">
        <RoleInputSelect ref="roleinput"  v-model="form.parentId">
        </RoleInputSelect>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateBtnClick" :loading="addLoading">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import RoleTree from './RoleTree.vue'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import OfficeInputSelect from '@/views/office/OfficeInputSelect'
  import RoleInputSelect from '@/views/role/RoleInputSelect.vue'
  export default {
    name: 'RoleEdit',
    components: {
      RoleTree,
      OfficeInputSelect,
      RoleInputSelect,
      SelfDictSelect},
    data () {
      return {
        // 编辑的id
        id: null,
        form: {
          code: null,
          name: '',
          type: '',
          disabled: '',
          dataOfficeId: null,
          parentId: '0',
          updateTime: null
        },
        formDataLoading: false,
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
      this.id = this.$route.params.id
      this.loadEditData(this.id)
    },
    methods: {
      loadEditData (id) {
        this.resetForm()
        let self = this
        self.formDataLoading = true
        self.$http.get('/base/role/' + self.id)
          .then(function (response) {
            let content = response.data.data.content
            self.form.name = content.name
            self.form.type = content.type
            self.form.sequence = content.sequence
            self.form.parentId = content.parentId
            self.form.dataOfficeId = content.dataOfficeId
            self.form.disabled = content.disabled
            self.form.updateTime = content.updateAt
            self.formDataLoading = false
            return Promise.resolve({parentId: content.parentId, dataOfficeId: content.dataOfficeId})
          }).then(p => {
            // 父级回回显
            self.$refs.roleinput.initLabelName(p.parentId)
            // 机构回显
            this.$refs.officeinput.initLabelName(p.dataOfficeId)
          }).catch(function (response) {
            self.formDataLoading = false
          })
      },
      updateBtnClick () {
        let self = this
        if (self.addLoading === false) {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              // 请求添加
              self.addLoading = true
              self.$http.put('/base/role/' + self.id, self.form)
                .then(function (response) {
                  self.$message.info('角色修改成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  if (response.response.status === 404) {
                    self.$message.error('角色修改失败，数据不存在或已被他人修改，请刷新列表后再试')
                  } else if (response.response.status === 409) {
                    self.$message.error('字典修改失败，编码已存在')
                  } else {
                    self.$message.error('字典修改失败，请稍候再试')
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
    // tab切换如果参数不一样，重新加载数据
    beforeRouteEnter  (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        if (vm.id !== vm.$route.params.id) {
          vm.id = vm.$route.params.id
          vm.loadEditData(vm.id)
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
