<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" :rules="formRules" style="width: 460px;" label-width="100px" v-loading="formDataLoading">
      <el-form-item label="字典值" prop="value" required>
        <el-input  v-model="form.value"></el-input>
      </el-form-item>
      <el-form-item label="字典名" prop="name" required>
        <el-input  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="字典类型" prop="type" required>
        <el-input  v-model="form.type"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input  v-model="form.discription"></el-input>
      </el-form-item>
      <el-form-item label="显示顺序">
        <el-input-number v-model="form.sequence" :min="0" :max="1000" controls-position="right"></el-input-number>
      </el-form-item>
      <el-form-item label="是否系统" prop="isSystem" required>
        <self-dict-select v-model="form.isSystem" type="yes_no"></self-dict-select>
      </el-form-item>
      <el-form-item label="是否公共" prop="isPublic" required>
        <self-dict-select v-model="form.isPublic" type="yes_no"></self-dict-select>
      </el-form-item>
      <el-form-item label="父级">
        <DictInputSelect ref="dictinput" v-model="form.parentId">
        </DictInputSelect>
      </el-form-item>
      <el-form-item label="归属机构">
        <OfficeInputSelect ref="officeinput" v-model="form.dataOfficeId">
        </OfficeInputSelect>
      </el-form-item>
      <el-form-item label="归属区域">
        <AreaInputSelect ref="areainput" v-model="form.dataAreaId">
        </AreaInputSelect>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateBtnClick" :loading="addLoading">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import AreaInputSelect from '@/views/area/AreaInputSelect.vue'
  import DictInputSelect from '@/views/dict/DictInputSelect.vue'
  import OfficeInputSelect from '@/views/office/OfficeInputSelect.vue'
  export default {
    name: 'DictEdit',
    components: {SelfDictSelect, AreaInputSelect, DictInputSelect, OfficeInputSelect},
    data () {
      return {
        // 编辑的id
        id: null,
        form: {
          value: '',
          name: '',
          type: '',
          discription: '',
          sequence: '',
          isSystem: '',
          isPublic: '',
          parentId: '0',
          dataOfficeId: null,
          dataAreaId: null,
          updateTime: null
        },
        formDataLoading: false,
        addLoading: false,
        formRules: {
          value: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          isSystem: [
            {required: true, message: '必填', trigger: 'change'}
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
        self.$http.get('/base/dict/' + self.id)
          .then(function (response) {
            let content = response.data.data.content
            self.form.value = content.value
            self.form.name = content.name
            self.form.type = content.type
            self.form.discription = content.discription
            self.form.sequence = content.sequence
            self.form.isSystem = content.isSystem
            self.form.isPublic = content.isPublic
            self.form.parentId = content.parentId
            self.form.dataOfficeId = content.dataOfficeId
            self.form.dataAreaId = content.dataAreaId
            self.form.updateTime = content.updateAt
            self.formDataLoading = false
            return Promise.resolve({parentId: content.parentId, officeId: content.dataOfficeId, areaId: content.dataAreaId})
          }).then(p => {
            // 回显机构
            self.$refs.officeinput.initLabelName(p.officeId)
            // 回显区域
            self.$refs.areainput.initLabelName(p.areaId)
            // 回显父级
            self.$refs.dictinput.initLabelName(p.parentId)
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
              self.$http.put('/base/dict/' + self.id, self.form)
                .then(function (response) {
                  self.$message.info('字典修改成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  if (response.response.status === 404) {
                    self.$message.error('字典修改失败，数据不存在或已被他人修改，请刷新列表后再试')
                  } else if (response.response.status === 409) {
                    self.$message.error('字典修改失败，类型已存在')
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
        this.$refs.areainput.setLabelName(null)
        this.$refs.dictinput.setLabelName(null)
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
