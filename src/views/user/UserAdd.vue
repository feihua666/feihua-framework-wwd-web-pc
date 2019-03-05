<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" :rules="formRules" style="width: 460px;" label-width="100px" v-loading="formDataLoading">
      <el-form-item label="帐号" prop="account">
        <el-input  v-model="form.account"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input  v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password"  v-model="form.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <self-dict-select v-model="form.gender" type="gender"></self-dict-select>
      </el-form-item>
      <el-form-item label="是否锁定" prop="locked">
        <self-dict-select v-model="form.locked" type="yes_no"></self-dict-select>
      </el-form-item>
      <el-form-item label="机构">
        <OfficeInputSelect ref="officeinput"  v-model="form.dataOfficeId">
        </OfficeInputSelect>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addBtnClick" :loading="addLoading">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import loadDataControl from '@/utils/storeLoadDataControlUtils.js'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import OfficeTree from '@/views/office/OfficeTree.vue'
  import OfficeInputSelect from '@/views/office/OfficeInputSelect'
  export default {
    components: {
      OfficeTree,
      SelfDictSelect,
      OfficeInputSelect},
    name: 'UserAdd',
    data () {
      return {
        form: {
          account: null,
          nickname: '',
          locked: '',
          gender: '',
          dataOfficeId: null,
          password: null
        },
        formDataLoading: false,
        addLoading: false,
        formRules: {
          account: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          locked: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          nickname: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          gender: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          password: [
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
              self.$http.post('/base/user', self.form)
                .then(function (response) {
                  self.$message.info('用户添加成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  self.$message.error('用户添加失败，请稍后再试')
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
        this.$refs['officeinput'].setLabelName(null)
      }
    },
    watch: {
    },
    beforeRouteEnter  (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        let dataControl = 'UserAddLoadData=true'
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
  overflow: auto;
  height: 100%;
}
</style>
