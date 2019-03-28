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
const utils = {
  isArray: isArray,
  arrayToTree: arrayToTree,
  loadDataControl: {
    add: addLoadDataControl,
    has: existLoadDataControl,
    remove: removeLoadDataControl
  },
  dGetValue: dGetValue
}
export default utils
