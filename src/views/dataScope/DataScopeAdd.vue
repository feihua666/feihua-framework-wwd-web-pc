<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" :rules="formRules" style="width: 460px;" label-width="100px">
      <el-form-item label="名称" prop="name" required>
        <el-input  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <self-dict-select v-model="form.type" type="dataScope_type"></self-dict-select>
      </el-form-item>
      <el-form-item label="机构" prop="dataOfficeId">
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
  import { mapGetters } from 'vuex'
  import loadDataControl from '@/utils/storeLoadDataControlUtils.js'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import OfficeInputSelect from '@/views/office/OfficeInputSelect'
  export default {
    components: {
      SelfDictSelect, OfficeInputSelect },
    name: 'DataScopeAdd',
    data () {
      return {
        form: {
          name: null,
          type: '',
          dataOfficeId: null
        },
        addLoading: false,
        formRules: {
          name: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          dataOfficeId: [
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
              self.$http.post('/base/dataScope', self.form)
                .then(function (response) {
                  self.$message.info('数据范围添加成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  self.$message.error('数据范围添加失败，请稍后再试')
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
        this.form.dataOfficeId = this.loginUser.additionalAttr.office.id
        this.$refs.officeinput.setLabelName(this.loginUser.additionalAttr.office.name)
      }
    },
    computed: {
      ...mapGetters([
        'loginUser'
      ])
    },
    watch: {
      // 防止刷新的时候没有数据
      loginUser () {
        this.form.dataOfficeId = this.loginUser.additionalAttr.office.id
        this.$refs.officeinput.setLabelName(this.loginUser.additionalAttr.office.name)
      }
    },
    beforeRouteEnter  (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        let dataControl = 'DataScopeAddLoadData=true'
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
