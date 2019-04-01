import {getRegExps} from "./httpUtils";

const isArray = function (obj) {
  if (Array.isArray) {
    return Array.isArray(obj)
  } else {
    return Object.prototype.toString.call(obj) === '[object Array]'
  }
}
// 将打平的数组改成父子关系数组
const arrayToTree = function (sNodes) {
  let i
  let l
  let key = 'id'
  let parentKey = 'parentId'
  let childKey = 'children'
  if (!sNodes) return []
  if (isArray(sNodes)) {
    var r = []
    var tmpMap = []
    for (i = 0, l = sNodes.length; i < l; i++) {
      tmpMap[sNodes[i][key]] = sNodes[i]
    }
    for (i = 0, l = sNodes.length; i < l; i++) {
      if (tmpMap[sNodes[i][parentKey]] && sNodes[i][key] !== sNodes[i][parentKey]) {
        if (!tmpMap[sNodes[i][parentKey]][childKey]) {
          tmpMap[sNodes[i][parentKey]][childKey] = []
        }
        tmpMap[sNodes[i][parentKey]][childKey].push(sNodes[i])
        sNodes.splice(i, 1)
        i--
        l--
      } else {
        r.push(sNodes[i])
      }
    }
    return r
  } else {
    return [sNodes]
  }
}
let loadDataControl = []
const addLoadDataControl = function (value) {
  loadDataControl.push(value)
}
const existLoadDataControl = function (value) {
  let index = loadDataControl.indexOf(value)
  return index >= 0
}
const removeLoadDataControl = function (value) {
  let index = loadDataControl.indexOf(value)
  loadDataControl.splice(index, 1)
}
// 深度获取对象属性，attr支持点，如：a.b.c
const dGetValue = function (obj, attr) {
  let value = obj
  let key = attr.split('.')
  for (let i = 0; i < key.length; i++) {
    value = value[key[i]]
  }
  return value
}
// 转换成blob
let getObjectURL = function (file) {
  var url = null
  if (window.createObjectURL !== undefined) {
    // basic
    url = window.createObjectURL(file)
  } else if (window.URL !== undefined) {
    // mozilla(firefox)
    url = window.URL.createObjectURL(file)
  } else if (window.webkitURL !== undefined) {
    // webkit or chrome
    url = window.webkitURL.createObjectURL(file)
  }
  return url
}
// 文件相关操作
const file = {
  // 将图片转换为Base64
  imageToDataUrl (url) {
    return new Promise((resolve, reject) => {
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      let img = new Image()
      img.onload = function () {
        canvas.height = img.height
        canvas.width = img.width
        ctx.drawImage(img, 0, 0)
        let dataURL = canvas.toDataURL('image/png')
        resolve(dataURL)
        canvas = null
      }
      img.src = url
    })
  },
  // 将base64转换为文件
  dataUrltoFile (dataUrl) {
    let arr = dataUrl.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    let fileExt = mime.replace('image/', '')
    return new File([u8arr], 'file_' + Date.parse(new Date()) + '.' + fileExt, {type: mime})
  },
  dataUrltoBlob (dataUrl) {
    let arr = dataUrl.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], {type: mime})
  }
}
const utils = {
  isArray: isArray,
  arrayToTree: arrayToTree,
  loadDataControl: {
    add: addLoadDataControl,
    has: existLoadDataControl,
    remove: removeLoadDataControl
  },
  dGetValue: dGetValue,
  file: file,
  getObjectURL: getObjectURL
}
export default utils
