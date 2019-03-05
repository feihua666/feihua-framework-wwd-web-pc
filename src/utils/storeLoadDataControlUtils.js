function addLoadDataControl (store, value) {
  store.commit('addDataControl', value)
}
function existLoadDataControl (store, value) {
  let index = store.getters.dataControl.indexOf(value)
  return index >= 0
}
function removeLoadDataControl (store, value) {
  store.commit('delDataControl', value)
}
const LoadDataControl = {
  add: addLoadDataControl,
  has: existLoadDataControl,
  remove: removeLoadDataControl
}
export default LoadDataControl
