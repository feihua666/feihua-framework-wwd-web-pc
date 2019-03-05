<template>
  <div>
    <el-popover
      ref="channelSelect"
      placement="right"
      v-on:show="popoverShow"
      trigger="click">
      <el-scrollbar wrapStyle="max-height:500px;">
        <ChannelTree ref="channelTree" v-on:nodeClick="treeNodeClick" :site-id="siteId" :loadData="false" :watch-site-id="false"></ChannelTree>
      </el-scrollbar>
    </el-popover>
    <el-input style="display: none;" value="" v-model="model">
    </el-input>
    <el-input   value="" v-model="name" v-on:focus="handleFocus($event)" v-on:handleBlur="handleBlur($event)" v-on:change="emitChange" v-on:input="emitInput" :readonly="true" clearable>
      <el-button slot="append" icon="el-icon-search" v-popover:channelSelect></el-button>
      <i slot="suffix" class="el-input__icon el-icon-circle-close el-input__clear" @click="setLabelName(null)"></i>
    </el-input>
  </div>
</template>

<script>
  import ChannelTree from '@/views/cms/channel/ChannelTree.vue'
  export default {
    components: {ChannelTree},
    name: 'ChannelInputSelect',
    props: {
      value: '',
      labelName: '',
      siteId: ''
    },
    data () {
      return {
        model: '',
        name: '',
        firstShowPopover: false
      }
    },
    mounted () {
    },
    methods: {
      handleFocus (event) {
        this.$emit('focus', event)
      },
      handleBlur (event) {
        this.$emit('blur', event)
      },
      emitChange (val) {
        this.name = val
        this.$emit('change', this.model)
      },
      emitInput (val) {
        this.name = val
        this.$emit('input', this.model)
      },
      treeNodeClick (data) {
        this.model = data.id
        this.name = data.name
        this.$emit('change', this.model)
        this.$emit('input', this.model)
      },
      setLabelName (name) {
        this.name = name
      },
      initLabelName (id) {
        let _id = id
        if (!_id) {
          _id = this.model
        }
        if (_id) {
          this.$http.get('/cms/channel/' + _id).then(response => {
            let content = response.data.data.content
            this.name = content.name
          }).catch(() => {
            this.name = null
          })
        } else {
          this.name = null
        }
      },
      popoverShow () {
        if (this.firstShowPopover === false) {
          this.$refs.channelTree.loadTreeData()
          this.firstShowPopover = true
        }
      }
    },
    watch: {
      value (val) {
        this.model = val
      },
      name (val) {
        if (val === '' || val == null) {
          this.model = ''
          this.$emit('change', this.model)
          this.$emit('input', this.model)
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
