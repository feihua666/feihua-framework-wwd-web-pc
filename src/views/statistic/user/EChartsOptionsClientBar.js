export default function () {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      data: ['总数量', '在线总数量', '男数量', '在线男数量', '女数量', '在线女数量', '其它数量', '在线其它数量']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '30%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: []
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
    ]
  }
  return option
}
