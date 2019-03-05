import $ from 'jquery'
export function arrayToTree (sNodes) {
  let i
  let l
  let key = 'id'
  let parentKey = 'parentId'
  let childKey = 'children'
  if (!sNodes) return []
  if ($.isArray(sNodes)) {
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
