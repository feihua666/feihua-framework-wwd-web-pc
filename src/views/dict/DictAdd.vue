<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" :rules="formRules" style="width: 460px;" label-width="100px">
      <el-form-item label="字典值" prop="value" required>
        <el-input  v-model="form.value"></el-input>
      </el-form-item>
      <el-form-item label="字典名" prop="name" required>
        <el-input  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="字典类型" prop="type" required>
        <el-input  v-model="form.type"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="discription">
        <el-input  v-model="form.discription"></el-input>
      </el-form-item>
      <el-form-item label="显示顺序" prop="sequence">
        <el-input-number v-model="form.sequence" :min="0" :max="1000" controls-position="right"></el-input-number>
      </el-form-item>
      <el-form-item label="是否系统" prop="isSystem" required>
        <self-dict-select v-model="form.isSystem" type="yes_no"></self-dict-select>
      </el-form-item>
      <el-form-item label="是否公共" prop="isPublic" required>
        <self-dict-select v-model="form.isPublic" type="yes_no"></self-dict-select>
      </el-form-item>
      <el-form-item label="父级" prop="parentId">
        <DictInputSelect ref="dictinput" v-model="form.parentId">
        </DictInputSelect>
      </el-form-item>
      <el-form-item label="归属机构" prop="dataOfficeId">
        <OfficeInputSelect ref="officeinput" v-model="form.dataOfficeId">
        </OfficeInputSelect>
      </el-form-item>
      <el-form-item label="归属区域" prop="dataAreaId">
        <AreaInputSelect ref="areainput" v-model="form.dataAreaId">
        </AreaInputSelect>
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
  import AreaInputSelect from '@/views/area/AreaInputSelect.vue'
  import DictInputSelect from '@/views/dict/DictInputSelect.vue'
  import OfficeInputSelect from '@/views/office/OfficeInputSelect.vue'
  export default {
    components: {SelfDictSelect, AreaInputSelect, DictInputSelect, OfficeInputSelect},
    name: 'DictAdd',
    data () {
      return {
        form: {
          value: null,
          name: null,
          type: null,
          discription: null,
          sequence: null,
          isSystem: '',
          isPublic: '',
          parentId: '0',
          dataOfficeId: null,
          dataAreaId: null
        },
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
          ],
          isPublic: [
            {required: true, message: '必填', trigger: 'change'}
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
              self.$http.post('/base/dict', self.form)
                .then(function (response) {
                  self.$message.info('字典添加成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  if (response.response.status === 409) {
                    self.$message.error('字典添加失败，类型已存在')
                  } else {
                    self.$message.error('字典添加失败，请稍后再试')
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
    watch: {
    },
    beforeRouteEnter  (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        let dataControl = 'DictAddLoadData=true'
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
