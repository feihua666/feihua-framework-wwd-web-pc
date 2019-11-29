<template>
  <el-transfer
    filterable
    :titles="['待选','已选']"
    filter-placeholder="请输入性名"
    v-model="valueData"
    :data="leftData"
    v-on:change="change"
    v-loading="dataloading"
  >
  </el-transfer>
</template>

<script>
  export default {
    name: 'ActivityUserTransfer',
    props: {
      value: {
        default: function () {
          return []
        }
      },
      activityId: {
        default: null
      }
    },
    data () {
      return {
        participateForm: {
          orderable: true,
          orderby: 'update_at-asc',
          pageable: false,
          wwdActivityId: null,
          payStatus: 'paid,offline_pay',
          status: 'normal,alternate'
        },
        dataloading: false,
        leftData: [],
        valueData: []
      }
    },
    mounted () {
      this.participateForm.wwdActivityId = this.activityId
      console.log('UserTransfer')
      this.valueData = this.value
      this.loadData()
    },
    methods: {
      loadData () {
        let self = this
        self.dataloading = true
        self.$http.get('/wwd/participates', self.participateForm).then(function (res) {
          let content = res.data.data.content
          let tempLeftData = []
          for (let i = 0; i < content.length; i++) {
            tempLeftData.push({
              key: content[i].wwdUserDto.userId,
              label: content[i].wwdUserDto.nickname
            })
          }
          self.leftData = tempLeftData
          self.dataloading = false
        }).catch(function () {
          self.dataloading = false
        })
      },
      change (a, b, c) {
        this.$emit('input', a)
        this.$emit('change', a, b, c)
      }
    },
    watch: {
      activityId (val, oldval) {
        let self = this
        self.participateForm.wwdActivityId = val
        self.loadData()
        console.log(val)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
