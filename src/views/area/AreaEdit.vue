<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" :rules="formRules" style="width: 460px;" label-width="100px" v-loading="formDataLoading">
      <el-form-item label="名称" prop="name" required>
        <el-input  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type" required>
        <self-dict-select v-model="form.type" type="area_type"></self-dict-select>
      </el-form-item>
      <el-form-item label="父级">
        <AreaInputSelect ref="areainput"  v-model="form.parentId">
        </AreaInputSelect>
      </el-form-item>

      <el-form-item label="显示顺序">
        <el-input-number v-model="form.sequence" :min="0" :max="1000" controls-position="right"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateBtnClick" :loading="addLoading">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import AreaInputSelect from '@/views/area/AreaInputSelect.vue'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  export default {
    name: 'AreaEdit',
    components: {AreaInputSelect, SelfDictSelect},
    data () {
      return {
        // 编辑的id
        id: null,
        form: {
          name: '',
          type: '',
          sequence: '',
          parentId: '0',
          updateTime: null
        },
        formDataLoading: false,
        addLoading: false,
        formRules: {
          name: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          type: [
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
        self.$http.get('/base/area/' + self.id)
          .then(function (response) {
            let content = response.data.data.content
            self.form.name = content.name
            self.form.type = content.type
            self.form.sequence = content.sequence
            self.form.parentId = content.parentId
            self.form.updateTime = content.updateAt
            self.formDataLoading = false
            return Promise.resolve(content.parentId)
          }).then(parentId => {
            // 回显父级
            self.$refs.areainput.initLabelName(parentId)
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
              self.$http.put('/base/area/' + self.id, self.form)
                .then(function (response) {
                  self.$message.info('区域修改成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  if (response.response.status === 404) {
                    self.$message.error('区域修改失败，数据不存在或已被他人修改，请刷新列表后再试')
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
        this.$refs.areainput.setLabelName(null)
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
