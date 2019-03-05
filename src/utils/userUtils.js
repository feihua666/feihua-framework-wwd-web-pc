import http from '@/utils/httpUtils.js'
import store from '@/store/store.js'
export function getUserInfo () {
  let promise = new Promise(function (resolve, reject) {
    let dict = store.state.dict
    if (dict[1]) {
      resolve(dict[1])
    } else {
      http.get('/base/dicts/')
        .then(function (response) {
          let content = response.data.data.content
          dict[1] = content
          resolve(content)
        }).catch(function (error) {
          reject(error)
        })
    }
  })
  return promise
}
