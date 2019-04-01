import Axios from 'axios'
import Qs from 'qs'
import { getMsg } from '@/utils/httpReponseCode.js'
import { Message } from 'element-ui'
import config from '@/config/config.js'

Axios.defaults.baseURL = config.hostApi
/**
 * 定义一下不提示消息的对象
 * @type 404: ['E404_000001']
 */
let noneMessageStatus = {
  404: []
}

function handlerError (status, code) {
  let statusObj = noneMessageStatus[status]
  if (statusObj) {
    if (statusObj.length === 0) {
      return
    } else {
      for (let obj in statusObj) {
        if (obj === code) {
          return
        }
      }
    }
  }
  let msg = getMsg(status, code)
  if (msg) {
    Message.error(msg)
  }
}

Axios.interceptors.request.use((config) => {
  if (!config.dataType || config.dataType !== 'json') {
    config.data = Qs.stringify(config.data, {allowDots: config.data && !config.data.qsDefault})
  }
  return config
}, function (error) {
  return Promise.reject(error)
})
// 添加响应拦截器
Axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, function (error) {
  // 对响应错误做点什么
  if (error.response) {
    handlerError(error.response.status, error.response.data.code)
  }
  return Promise.reject(error)
})
/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function get (url, params = {}) {
  return new Promise((resolve, reject) => {
    Axios.get(url, {
      params: params
    }).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post (url, data = {}) {
  return new Promise((resolve, reject) => {
    Axios.post(url, data)
      .then(response => {
        resolve(response)
      }, err => {
        reject(err)
      })
  })
}
/**
 * 封装postJson请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function postJson (url, data = {}) {
  return new Promise((resolve, reject) => {
    Axios.post(url, data, {dataType: 'json'})
      .then(response => {
        resolve(response)
      }, err => {
        reject(err)
      })
  })
}
/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put (url, data = {}) {
  return new Promise((resolve, reject) => {
    Axios.put(url, data)
      .then(response => {
        resolve(response)
      }, err => {
        reject(err)
      })
  })
}
/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function putJson (url, data = {}) {
  return new Promise((resolve, reject) => {
    Axios.put(url, data, {dataType: 'json'})
      .then(response => {
        resolve(response)
      }, err => {
        reject(err)
      })
  })
}
/**
 * 封装del方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function del (url, params = {}) {
  return new Promise((resolve, reject) => {
    Axios.delete(url, {
      params: params
    }).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

const uploadFile = function (file, data = {}) {
  return new Promise((resolve, reject) => {
    let param = new FormData()
    // 通过append向form对象添加数据
    param.append('file', file, file.name)
    for (let key in data) {
      param.append(key, data[key])
    }
    let headers = {
      headers: {'Content-Type': 'multipart/form-data'},
      baseURL: null,
      dataType: 'json'
    }
    Axios.post(config.file.uploadUrl + '?t=' + (new Date().getTime() + Math.random()), param, headers)
      .then(response => {
        resolve(response)
      }, err => {
        reject(err)
      })
  })
}
/**
 * 根据类型获取字典数据，返回结果应该是一个数组，如果type是以逗号分隔的字符串字典类型，则返回的结果是一个对象key为类型字符串本身
 * @param type
 * @returns {Promise<any>}
 */
let cacheDict = {}
export function getDictsByType (type) {
  let promise = new Promise((resolve, reject) => {
    if (cacheDict[type]) {
      resolve(cacheDict[type])
    } else {
      Axios.get('/base/dicts/' + type, {
        params: {orderby: 'sequence', t: new Date().getTime() + Math.random()}
      }).then(response => {
        let content = response.data.data.content
        cacheDict[type] = content
        resolve(content)
      }).catch(err => {
        reject(err)
      })
    }
  })
  return promise
}

/**
 * 根据字典值和类型获取字典对象
 * @param type
 * @param value
 * @returns {Promise<any>}
 */
export function getDictByValue (type, value) {
  return new Promise((resolve, reject) => {
    getDictsByType(type).then(content => {
      let dicts = content
      if (dicts) {
        for (let i = 0; i < dicts.length; i++) {
          if (value === dicts[i].value) {
            resolve(dicts[i])
            break
          }
        }
      }
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 获取后台配置的正则表达式
 * @returns {Promise<any>}
 */
let cacheRegexps = null
export function getRegExps () {
  let promise = new Promise((resolve, reject) => {
    if (cacheRegexps) {
      resolve(cacheRegexps)
    } else {
      Axios.get('/regexps', {
        params: {t: new Date().getTime() + Math.random()}
      }).then(response => {
        cacheRegexps = response.data.data.content
        resolve(cacheRegexps)
      }).catch(err => {
        reject(err)
      })
    }
  })
  return promise
}

/**
 * 获取单个正则，
 * @param type 如：mobile为验证手机号的正则
 * @returns {Promise<any>}
 */
export function getRegExpByType (type) {
  return new Promise((resolve, reject) => {
    getRegExps().then(regexps => {
      let regExps = cacheRegexps
      resolve(regExps[type])
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 获取当前登录用户信息
 * @returns {Promise<any>}
 */
export function getCurrentUserinfo () {
  return new Promise((resolve, reject) => {
    Axios.get('/base/user/current', {
      params: {t: new Date().getTime() + Math.random()}
    }).then(response => {
      resolve(response.data.data.content)
    }).catch(err => {
      reject(err)
    })
  })
}
/**
 * 是否已登录
 * @returns {Promise<any>}
 */
export function hasLogin () {
  return new Promise((resolve, reject) => {
    getCurrentUserinfo.then(response => {
      resolve()
    }).catch(err => {
      let statusCode = err.statusCode
      if (statusCode === 401) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
const http = {
  get: get,
  post: post,
  postJson: postJson,
  delete: del,
  put: put,
  putJson: putJson,
  uploadFile: uploadFile,
  getDictsByType: getDictsByType,
  getDictByValue: getDictByValue,
  getRegExps: getRegExps,
  getRegExpByType: getRegExpByType,
  getCurrentUserinfo: getCurrentUserinfo,
  hasLogin: hasLogin
}
export default http
