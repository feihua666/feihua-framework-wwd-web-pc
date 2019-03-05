export function getRegExpsSync (vueObj) {
  let regExp = vueObj.$store.state.regExp
  if (regExp) {
    return regExp
  } else {
    let data = vueObj.$http.getSync('/regexps')
    if (data && data.data.content) {
      vueObj.$store.commit('setRegExp', data.data.content)
      return data.data.content
    }
  }
  return null
}
export function getRegExpByTypeSync (vueObj, type) {
  let regExp = getRegExpsSync(vueObj)
  if (regExp) {
    return regExp[type]
  }
  return null
}
