<template>
    <div class="wrapper">
      <el-container>
        <el-main>
          <el-collapse value="1">
            <el-collapse-item title="查询条件" name="1">
              <el-form ref="searchForm" :model="searchFormModel" :inline="true" size="small">
                <el-form-item label="日期">
                  <el-date-picker
                    v-model="searchFormModel.dateStr"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="searchBtnClick">查询</el-button>
                  <el-button type="primary" @click="refreshBtnClick">刷新</el-button>
                </el-form-item>
              </el-form>
            </el-collapse-item>
          </el-collapse>
          <self-calendar ref="selfcalendar" v-on:itemclick="itemclick" :defaultDate="dateStrEntry" :show-head="false"></self-calendar>
        </el-main>
      </el-container>
    </div>
</template>

<script>
  import SelfCalendar from '@/components/SelfCalendar'
  import loadDataControl from '@/utils/storeLoadDataControlUtils.js'
  export default {
    components: {SelfCalendar},
    name: 'CalendarSetting',
    data () {
      return {
        // 搜索的查询条件
        searchFormModel: {
          dateStr: ''
        },
        dateStrEntry: ''
      }
    },
    mounted () {
    },
    methods: {
      searchBtnClick () {
        this.dateStrEntry = this.searchFormModel.dateStr
      },
      deleteCalendarExtend (id) {
        let self = this
        this.$confirm('确定要删除吗, 是否继续?', '提示', {
          type: 'warning'
        }).then(() => {
          this.$http.delete('/base/calendarextend/' + id)
            .then(function (response) {
              self.$message.success('删除成功')
              // 重新加载数据
              self.refreshBtnClick()
            })
            .catch(function (error) {
              if (error.response.status === 404) {
                self.$message.error('删除失败，请刷新数据再试')
              }
            })
        })
      },
      itemclick (val) {
        if (val) {
          // 查询日期是否存在，存在修改，不存在添加
          let self = this
          self.$http.get('/base/calendarextends', {year: val.year, month: val.month, day: val.day})
            .then(res => {
              let contentItem = res.data.data.content[0]
              // 存在
              this.$confirm('当前日期已设置扩展信息，请选择要进行的操作', '确认信息' + val.year + '-' + val.month + '-' + val.day, {
                distinguishCancelAndClose: true,
                confirmButtonText: '修改',
                cancelButtonText: '删除'
              })
                .then(() => {
                  this.$router.push('/Main/CalendarSetting/CalendarSettingEdit/' + contentItem.id)
                })
                .catch(action => {
                  self.deleteCalendarExtend(contentItem.id)
                })
            }).catch((error) => {
              if (error.response.status === 404) {
                // 不存在
                loadDataControl.add(this.$store, 'CalendarSettingAddLoadData=true')
                self.$router.push('/Main/CalendarSetting/CalendarSettingAdd/' + val.year + '-' + val.month + '-' + val.day)
              }
            })
        }
      },
      refreshBtnClick () {
        this.$refs.selfcalendar.refresh()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .wrapper .el-collapse{
    padding: 0 10px;
  }
  .el-main{
    padding:0;
  }
  .el-aside{
    border-right: 1px solid #e6ebf5;
  }
  .wrapper,.el-container{
    height:100%;
  }
</style>
<style>
  .el-collapse-item__arrow {
    /* 由于用了rotate 这个东西不是个正方形所以改变角度的时候会出现滚动条 */
    margin-right: 20px;
  }
</style>
