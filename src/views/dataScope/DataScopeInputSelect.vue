<template>
  <div>
    <el-popover
      ref="treeSelect"
      placement="right"
      trigger="click">
      <el-scrollbar wrapStyle="max-height:500px;">
        <DataScopeTree v-on:nodeClick="treeNodeClick" :loadData="false"></DataScopeTree>
      </el-scrollbar>
    </el-popover>
    <el-input style="display: none;" value="" v-model="model">
    </el-input>
    <el-input   value="" v-model="name" v-on:focus="handleFocus($event)" v-on:handleBlur="handleBlur($event)" v-on:change="emitChange" v-on:input="emitInput" :readonly="true" clearable>
      <el-button slot="append" icon="el-icon-search" v-popover:treeSelect></el-button>
    </el-input>
  </div>
</template>

<script>
  import DataScopeTree from '@/views/dataScope/DataScopeTree.vue'
  export default {
    components: {DataScopeTree},
    name: 'DataScopeInputSelect',
    props: {
      value: '',
      labelName: ''
    },
    data () {
      return {
        model: '',
        name: ''
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
