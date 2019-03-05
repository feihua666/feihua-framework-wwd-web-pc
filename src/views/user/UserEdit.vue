<template>
  <div class="wrapper">

    <el-form ref="form" :model="form" :rules="formRules" style="width: 460px;" label-width="100px" v-loading="formDataLoading">
      <el-form-item label="帐号" prop="account">
        <el-input  v-model="form.account" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input  v-model="form.nickname"></el-input>
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
        <el-button type="primary" @click="updateBtnClick" :loading="addLoading">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import OfficeTree from '@/views/office/OfficeTree.vue'
  import OfficeInputSelect from '@/views/office/OfficeInputSelect'
  export default {
    name: 'UserEdit',
    components: {
      OfficeTree,
      SelfDictSelect,
      OfficeInputSelect},
    data () {
      return {
        // 编辑的id
        id: null,
        form: {
          account: null,
          nickname: '',
          locked: '',
          gender: '',
          dataOfficeId: null,
          userAccountUpdateAt: null,
          userMobileId: null,
          userMobileUpdateAt: null,
          userInfoId: null,
          userInfoUpdateAt: null
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
        self.$http.get('/base/user/' + self.id)
          .then(function (response) {
            let content = response.data.data.content
            self.form.account = content.account
            self.form.nickname = content.nickname
            self.form.mobile = content.mobile
            self.form.locked = content.locked
            self.form.dataOfficeId = content.dataOfficeId
            self.form.gender = content.gender
            self.form.userAccountUpdateAt = content.userAccountUpdateAt
            self.form.userMobileUpdateAt = content.userMobileUpdateAt
            self.form.userMobileId = content.userMobileId
            self.form.userInfoUpdateAt = content.userInfoUpdateAt
            self.form.userInfoId = content.userInfoId
            self.formDataLoading = false
            return Promise.resolve({dataOfficeId: content.dataOfficeId})
          }).then(p => {
            // 机构回显
            self.$refs.officeinput.initLabelName(p.dataOfficeId)
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
              self.$http.put('/base/user/' + self.id, self.form)
                .then(function (response) {
                  self.$message.info('用户修改成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  if (response.response.status === 404) {
                    self.$message.error('用户修改失败，数据不存在或已被他人修改，请刷新列表后再试')
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
        this.$refs['officeinput'].setLabelName(null)
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
    overflow: auto;
    height: 100%;
  }
</style>
