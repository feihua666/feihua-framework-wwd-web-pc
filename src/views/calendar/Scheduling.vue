<template>
  <div class="fh-page-wrapper">
   <calendar style="height: 800px;"/>
 </div>
</template>

<script>
  import 'tui-calendar/dist/tui-calendar.css'
  import { Calendar } from '@toast-ui/vue-calendar'
  export default {
    components: {
      'calendar': Calendar
    },
    name: 'Scheduling',
    data () {
      return {
      }
    },
    mounted () {
      console.log('DemoStarter mounted')
    },
    methods: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
