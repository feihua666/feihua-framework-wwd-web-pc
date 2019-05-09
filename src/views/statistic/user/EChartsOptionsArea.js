export default function () {
  let option = {
    tooltip: {
      trigger: 'item',
      formatter: function (p) {
        console.log(p)
        return p.seriesName + '<br/>' + p.name + ' : ' + p.value[2] + ' (男：' + p.value[3] + '女：' + p.value[4] + '其它：' + p.value[5] + ')'
      }
    },
    bmap: {
      center: [104.114129, 37.550339],
      zoom: 5,
      roam: true,
      mapStyle: {
        styleJson: [
          {
            'featureType': 'water',
            'elementType': 'all',
            'stylers': {
              'color': '#044161'
            }
          },
          {
            'featureType': 'land',
            'elementType': 'all',
            'stylers': {
              'color': '#004981'
            }
          },
          {
            'featureType': 'boundary',
            'elementType': 'geometry',
            'stylers': {
              'color': '#064f85'
            }
          },
          {
            'featureType': 'railway',
            'elementType': 'all',
            'stylers': {
              'visibility': 'off'
            }
          },
          {
            'featureType': 'highway',
            'elementType': 'geometry',
            'stylers': {
              'color': '#004981'
            }
          },
          {
            'featureType': 'highway',
            'elementType': 'geometry.fill',
            'stylers': {
              'color': '#005b96',
              'lightness': 1
            }
          },
          {
            'featureType': 'highway',
            'elementType': 'labels',
            'stylers': {
              'visibility': 'off'
            }
          },
          {
            'featureType': 'arterial',
            'elementType': 'geometry',
            'stylers': {
              'color': '#004981'
            }
          },
          {
            'featureType': 'arterial',
            'elementType': 'geometry.fill',
            'stylers': {
              'color': '#00508b'
            }
          },
          {
            'featureType': 'poi',
            'elementType': 'all',
            'stylers': {
              'visibility': 'off'
            }
          },
          {
            'featureType': 'green',
            'elementType': 'all',
            'stylers': {
              'color': '#056197',
              'visibility': 'off'
            }
          },
          {
            'featureType': 'subway',
            'elementType': 'all',
            'stylers': {
              'visibility': 'off'
            }
          },
          {
            'featureType': 'manmade',
            'elementType': 'all',
            'stylers': {
              'visibility': 'off'
            }
          },
          {
            'featureType': 'local',
            'elementType': 'all',
            'stylers': {
              'visibility': 'off'
            }
          },
          {
            'featureType': 'arterial',
            'elementType': 'labels',
            'stylers': {
              'visibility': 'off'
            }
          },
          {
            'featureType': 'boundary',
            'elementType': 'geometry.fill',
            'stylers': {
              'color': '#029fd4'
            }
          },
          {
            'featureType': 'building',
            'elementType': 'all',
            'stylers': {
              'color': '#1a5787'
            }
          },
          {
            'featureType': 'label',
            'elementType': 'all',
            'stylers': {
              'visibility': 'off'
            }
          }
        ]
      }
    },
    series: [
      {
        name: '用户数量',
        type: 'scatter',
        coordinateSystem: 'bmap',
        data: [],
        symbolSize: function (val) {
          let base = 5
          let r = 0
          if (val[2] > 0 && val[2] < 10) {
            r = base
          } else if (val[2] === 0) {
            r = 0
          } else {
            r = (val[2] / 10) + base
          }
          console.log(val)
          return r
        },
        label: {
          normal: {
            formatter: '{b}',
            position: 'right',
            show: false
          },
          emphasis: {
            show: true
          }
        },
        itemStyle: {
          normal: {
            color: '#ddb926'
          }
        }
      }
    ]
  }

  return option
}
