<template>
 <div>
   {{label}}
 </div>
</template>

<script>
  export default {
    name: 'SelfDictText',
    props: {
      type: {
        default: null
      },
      val: {
        default: null
      }
    },
    data () {
      return {
        label: null
      }
    },
    mounted () {
      this.setLabel(this.type, this.val)
    },
    watch: {
      type () {
        this.setLabel(this.type, this.val)
      },
      val () {
        this.setLabel(this.type, this.val)
      }
    },
    methods: {
      setLabel (type, val) {
        if (type && val) {
          let self = this
          this.$http.getDictByValue(type, val).then(function (dict) {
            self.label = dict.name
          })
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
