<template>
  <div class="wrapper">
    <el-popover
      ref="funResourceIconSelect"
      placement="right"
      trigger="click">
      <el-scrollbar wrapStyle="max-height:500px;">
        <fun-resource-icon  v-model="form.icon" v-on:change="funResourceIconChange"></fun-resource-icon>
      </el-scrollbar>
    </el-popover>
    <el-form ref="form" :model="form" :rules="formRules" style="width: 460px;" label-width="100px">
      <el-form-item label="名称" prop="name" required>
        <el-input  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <self-dict-select v-model="form.type" type="funResource_type"></self-dict-select>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input  v-model="form.icon">
          <i slot="prepend" :class="form.icon"></i>
          <el-button slot="append" icon="el-icon-search"  v-popover:funResourceIconSelect></el-button>
        </el-input>
      </el-form-item>

      <el-form-item label="是否显示" prop="isShow" required>
        <self-dict-select v-model="form.isShow" type="yes_no"></self-dict-select>
      </el-form-item>
      <el-form-item label="url" prop="url" v-if="form.type == 'link_page' || form.type == 'link'">
        <el-input  v-model="form.url"></el-input>
      </el-form-item>
      <el-form-item label="权限标识">
        <el-input  v-model="form.permissions"></el-input>
      </el-form-item>
      <el-form-item label="显示顺序" prop="sequence">
        <el-input-number v-model="form.sequence" :min="0" :max="1000" controls-position="right"></el-input-number>
      </el-form-item>
      <el-form-item label="父级" prop="parentId">
        <FunResourceInputSelect ref="funResourceParentinput"  v-model="form.parentId">
        </FunResourceInputSelect>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addBtnClick" :loading="addLoading">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import FunResourceTree from './FunResourceTree.vue'
  import loadDataControl from '@/utils/storeLoadDataControlUtils.js'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import OfficeTree from '@/views/office/OfficeTree.vue'
  import FunResourceIcon from '@/views/funResource/FunResourceIcon.vue'
  import FunResourceInputSelect from '@/views/funResource/FunResourceInputSelect.vue'
  export default {
    components: {
      FunResourceIcon,
      OfficeTree,
      FunResourceTree,
      SelfDictSelect,
      FunResourceInputSelect},
    name: 'FunResourceAdd',
    data () {
      let validateUrl = (rule, value, callback) => {
        if ((value === '' || value == null) && (this.form.type === 'link_page' || this.form.type === 'link')) {
          callback(new Error('必填'))
        } else {
          callback()
        }
      }
      return {
        form: {
          icon: null,
          isShow: '',
          name: null,
          url: null,
          type: '',
          permissions: null,
          sequence: null,
          parentId: '0'
        },
        addLoading: false,
        formLabel: {
          parentIdName: null
        },
        formRules: {
          name: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          isShow: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          sequence: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          url: [
            {validator: validateUrl, trigger: 'blur'}
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
              self.$http.post('/base/functionResource', self.form)
                .then(function (response) {
                  self.$message.info('功能资源添加成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  self.$message.error('功能资源添加失败，请稍后再试')
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
        this.$refs.funResourceParentinput.setLabelName(null)
      },
      funResourceIconChange (icon) {
        this.form.icon = icon
      }
    },
    watch: {
      'form.type' (val) {
        if (val === 'menu' || val === 'link_page' || val === 'link') {
          this.form.isShow = 'Y'
        } else {
          this.form.isShow = 'N'
        }
      }
    },
    beforeRouteEnter  (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        let dataControl = 'FunResourceAddLoadData=true'
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
