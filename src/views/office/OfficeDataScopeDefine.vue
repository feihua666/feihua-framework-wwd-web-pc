<template>
  <el-form ref="form" :model="form" :rules="formRules" style="width: 460px;" label-width="120px" v-loading="formDataLoading">
    <el-form-item label="机构数据范围" prop="type">
      <self-dict-select v-model="form.type" type="office_dataScope" :show-none="false"></self-dict-select>
    </el-form-item>
    <el-form-item v-show="form.type === 'self'">
      <OfficeTree ref="officetree" show-checkbox></OfficeTree>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitBtnClick" :loading="addLoading">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import OfficeTree from './OfficeTree.vue'
  export default {
    name: 'OfficeDataScopeDefine',
    components: {
      OfficeTree,
      SelfDictSelect},
    props: {
      // 数据范围id,父级传来的
      dataScopeId: {
        default: null
      }
    },
    data () {
      return {
        form: {
          type: null, // 机构数据范围的下拉选项值
          id: null,   // 机构数据范围定义的id
          updateTime: null,  // 更新时间，乐观锁用
          officeIds: []
        },
        formDataLoading: false,
        addLoading: false,
        formRules: {
          type: [
            {required: true, message: '必填', trigger: 'blur'}
          ]
        }
      }
    },
    mounted () {
      // this.loadData()
    },
    methods: {
      loadData () {
        let self = this
        this.resetForm()
        let selectedOfficeIds = []
        // 根据scope查询，如果没有数据则提交添加方法
        this.$http.get('/base/dataScope/' + this.dataScopeId + '/office/define')
          .then(function (response) {
            let content = response.data.data.content
            self.form.id = content.id
            self.form.type = content.type
            self.form.updateTime = content.updateAt
            // 自定义设置
            if (content && content.type === 'self') {
              let selfOffices = response.data.data.self
              for (let item in selfOffices) {
                selectedOfficeIds.push(selfOffices[item].officeId)
              }
            }
            self.$refs.officetree.setCheckedKeys(selectedOfficeIds)
            self.tableLoading = false
          }).catch(function (error) {
            if (error.response.status === 404) {
              self.form.id = null
              self.form.type = null
            }
          })
      },
      saveData () {
        let self = this
        this.$refs['form'].validate((valid) => {
          if (valid) {
            self.addData()
          } else {
            return false
          }
        })
      },
      addData () {
        let self = this
        self.addLoading = true
        // 设置自定义勾选
        if (self.form.type === 'self') {
          self.form.officeIds = self.$refs.officetree.getAllCheckedKeys()
        }
        this.$http.post('/base/dataScope/' + this.dataScopeId + '/office/define', this.form)
          .then(reponse => {
            self.$message.info('机构数据范围定义设置成功')
            self.addLoading = false
          }).catch(function (response) {
            self.$message.error('机构数据范围定义设置失败，请稍后再试')
            self.addLoading = false
          })
      },
      resetForm () {
        this.$refs['form'].resetFields()
        this.$refs.officetree.setCheckedKeys([])
      },
      submitBtnClick () {
        this.saveData()
      }
    },
    watch: {
      dataScopeId () {
        this.loadData()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
