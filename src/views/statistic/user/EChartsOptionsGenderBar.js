export default function () {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      data: ['男', '女', '其它']
    },
    grid: {
      containLabel: true,
      show: false,
      bottom: 20
    },
    xAxis: {
      containLabel: true,
      show: false,
      max: 0
    },
    yAxis: {
      type: 'category',
      show: false
    },
    series: [
      {
        name: '男',
        type: 'bar',
        stack: '总量',
        label: {
          normal: {
            show: true,
            position: 'insideRight'
          }
        },
        data: [0]
      },
      {
        name: '女',
        type: 'bar',
        stack: '总量',
        label: {
          normal: {
            show: true,
            position: 'insideRight'
          }
        },
        itemStyle: {
          color: '#FFC0CB'
        },
        data: [0]
      },
      {
        name: '其它',
        type: 'bar',
        stack: '总量',
        label: {
          normal: {
            show: true,
            position: 'insideRight'
          }
        },
        itemStyle: {
          color: '#FFD700'
        },
        data: [0]
      }
    ]
  }
  return option
}
