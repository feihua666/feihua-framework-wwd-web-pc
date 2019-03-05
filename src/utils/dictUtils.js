export function getDictsByType (vueObj, type) {
  let promise = new Promise(function (resolve, reject) {
    let dict = vueObj.$store.state.dict
    if (dict[type]) {
      resolve(dict[type])
    } else {
      vueObj.$http.get('/base/dicts/' + vueObj.type, {orderby: 'sequence'})
        .then(function (response) {
          let content = response.data.data.content
          dict[type] = content
          resolve(content)
        }).catch(function (error) {
          reject(error)
        })
    }
  })
  return promise
}
export function getDictsByTypeSync (vueObj, type) {
  let dict = vueObj.$store.state.dict
  if (dict[type]) {
    return dict[type]
  } else {
    let data = vueObj.$http.getSync('/base/dicts/' + type, {orderby: 'sequence'})
    if (data && data.data.content) {
      vueObj.$store.commit('addDict', {type: type, dicts: data.data.content})
      return data.data.content
    }
  }
  return null
}
export function getDictByValueSync (vueObj, type, value) {
  let dicts = getDictsByTypeSync(vueObj, type)
  if (dicts) {
    for (let i = 0; i < dicts.length; i++) {
      if (value === dicts[i].value) {
        return dicts[i]
      }
    }
  }

  return null
}
