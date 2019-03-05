<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" :rules="formRules" style="width: 460px;" label-width="100px">
      <el-form-item label="名称" prop="name" required>
        <el-input  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <self-dict-select v-model="form.type" type="office_type"></self-dict-select>
      </el-form-item>
      <el-form-item label="区域" prop="areaId">
        <AreaInputSelect ref="areainput"  v-model="form.areaId">
        </AreaInputSelect>
      </el-form-item>
      <el-form-item label="父级" prop="parentId">
        <OfficeInputSelect ref="officeinput"  v-model="form.parentId">
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
  import OfficeInputSelect from '@/views/office/OfficeInputSelect'
  import AreaInputSelect from '@/views/area/AreaInputSelect.vue'
  export default {
    components: {
      SelfDictSelect,
      AreaInputSelect,
      OfficeInputSelect
    },
    name: 'OfficeAdd',
    data () {
      return {
        form: {
          name: null,
          type: null,
          areaId: null,
          parentId: '0'
        },
        addLoading: false,
        formLabel: {
          parentIdName: null,
          areaIdName: null
        },
        formRules: {
          name: [
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
              self.$http.post('/base/office', self.form)
                .then(function (response) {
                  self.$message.info('机构添加成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  self.$message.error('机构添加失败，请稍后再试')
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
      }
    },
    watch: {
    },
    beforeRouteEnter  (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        let dataControl = 'OfficeAddLoadData=true'
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
