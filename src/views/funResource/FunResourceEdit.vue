<template>
  <div class="fh-page-wrapper">
    <el-popover
      ref="funResourceIconSelect"
      placement="right"
      trigger="click">
      <el-scrollbar wrapStyle="max-height:500px;">
        <fun-resource-icon  v-model="form.icon" v-on:change="funResourceIconChange"></fun-resource-icon>
      </el-scrollbar>
    </el-popover>
    <el-form ref="form" class="fh-background-white fh-padding-30" :model="form" :rules="formRules" style="width: 460px;" label-width="100px">
      <el-form-item label="名称" prop="name" required>
        <el-input  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <self-dict-select v-model="form.type" v-on:change="typeChange" type="funResource_type"></self-dict-select>
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
        <fun-resource-input-select ref="parentinput" v-model="form.parentId"></fun-resource-input-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-check" @click="updateBtnClick" :loading="addLoading">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import FunResourceTree from './FunResourceTree.vue'
  import SelfDictSelect from '@/components/SelfDictSelect.vue'
  import OfficeTree from '@/views/office/OfficeTree.vue'
  import FunResourceIcon from '@/views/funResource/FunResourceIcon.vue'
  import FunResourceInputSelect from '@/views/funResource/FunResourceInputSelect'
  export default {
    name: 'FunResourceEdit',
    components: {
      OfficeTree,
      FunResourceTree,
      SelfDictSelect,
      FunResourceIcon,
      FunResourceInputSelect
    },
    data () {
      let validateUrl = (rule, value, callback) => {
        if ((value === '' || value == null) && (this.form.type === 'link_page' || this.form.type === 'link')) {
          callback(new Error('必填'))
        } else {
          callback()
        }
      }
      return {
        // 编辑的id
        id: null,
        form: {
          icon: null,
          isShow: '',
          name: null,
          url: null,
          type: '',
          permissions: null,
          sequence: null,
          parentId: '0',
          updateTime: null
        },
        formDataLoading: false,
        addLoading: false,
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
      this.id = this.$route.params.id
      this.loadEditData(this.id)
    },
    methods: {
      loadEditData (id) {
        if (this.formDataLoading === true) {
          return
        }
        this.resetForm()
        let self = this
        self.formDataLoading = true
        self.$http.get('/base/functionResource/' + self.id)
          .then(function (response) {
            let content = response.data.data.content
            self.form.name = content.name
            self.form.type = content.type
            self.form.sequence = content.sequence
            self.form.isShow = content.isShow
            self.form.icon = content.icon
            self.form.permissions = content.permissions
            self.form.url = content.url
            self.form.dataOfficeId = content.dataOfficeId
            self.form.parentId = content.parentId
            self.form.updateTime = content.updateAt
            self.formDataLoading = false
            return Promise.resolve({parentId: content.parentId, dataOfficeId: content.dataOfficeId})
          }).then(p => {
            // 父级回回显
            self.$refs.parentinput.initLabelName(p.parentId)
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
              self.$http.put('/base/functionResource/' + self.id, self.form)
                .then(function (response) {
                  self.$message.success('功能资源修改成功')
                  self.addLoading = false
                })
                .catch(function (response) {
                  if (response.response.status === 404) {
                    self.$message.error('功能资源修改失败，数据不存在或已被他人修改，请刷新列表后再试')
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
        this.$refs.parentinput.setLabelName(null)
      },
      funResourceIconChange (icon) {
        this.form.icon = icon
      },
      typeChange (val) {
        if ((val === 'menu' || val === 'link_page' || val === 'link')) {
          this.form.isShow = 'Y'
        } else {
          this.form.isShow = 'N'
        }
      }
    },
    watch: {
    },
    // tab切换如果参数不一样，重新加载数据
    beforeRouteEnter  (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        let dataControl = 'FunResourceEditLoadData=true'
        if (vm.id !== vm.$route.params.id || vm.$utils.loadDataControl.has(dataControl)) {
          vm.id = vm.$route.params.id
          vm.loadEditData(vm.id)
          vm.$utils.loadDataControl.remove(dataControl)
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
