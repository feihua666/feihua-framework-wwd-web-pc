<template>
  <div class="fh-page-wrapper">
    <el-form ref="form" class="fh-background-white fh-padding-30" :model="form" :rules="formRules" style="width: 460px;"
             label-width="100px">

      <el-form-item label="岗位名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="岗位编码" prop="code">
        <el-input v-model="form.code"></el-input>
      </el-form-item>
      <el-form-item label="岗位类型" prop="type">
        <SelfDictSelect v-model="form.type" type="post_type"></SelfDictSelect>
      </el-form-item>
      <el-form-item label="岗位职务" prop="postJobId">
        <el-input v-model="form.postJobId"></el-input>
      </el-form-item>
      <el-form-item label="是否禁用" prop="disabled">
        <SelfDictSelect v-model="form.disabled" type="yes_no"></SelfDictSelect>
      </el-form-item>
      <el-form-item label="父级" prop="parentId">
        <PostInputSelect ref="postinput"  v-model="form.parentId">
        </PostInputSelect>
      </el-form-item>
      <el-form-item label="归属机构" prop="dataOfficeId">
        <OfficeInputSelect ref="officeinput"  v-model="form.dataOfficeId">
        </OfficeInputSelect>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-check" @click="addBtnClick" :loading="addLoading">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import OfficeInputSelect from '@/views/office/OfficeInputSelect'
  import PostInputSelect from '@/views/postjob/PostInputSelect.vue'
  export default {
    components: {
      SelfDictSelect,
      PostInputSelect,
      OfficeInputSelect
    },
    name: 'PostAdd',
    data () {
      return {
        form: {
          name: '',
          code: '',
          type: '',
          postJobId: '',
          disabled: '',
          parentId: '0',
          dataOfficeId: ''
        },
        addLoading: false,
        formRules: {
          name: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          disabled: [
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
              self.$http.post('/base/postjob/post', self.form)
                .then(function (response) {
                  self.$message.info('岗位添加成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  self.$message.error('岗位添加失败，请稍后再试')
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
        this.$refs.postinput.setLabelName(null)
      }
    },
    computed: {
    },
    watch: {
    },
    beforeRouteEnter  (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        let dataControl = 'PostAddLoadData=true'
        if (vm.$utils.loadDataControl.has(dataControl)) {
          // 重置表单
          vm.resetForm()
          vm.$utils.loadDataControl.remove(dataControl)
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
