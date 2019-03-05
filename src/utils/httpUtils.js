import Axios from 'axios'
import Qs from 'qs'
import $ from 'jquery'
import { getMsg } from '@/utils/httpReponseCode.js'
import { Message } from 'element-ui'
let baseURL = process.env.NODE_ENV === 'production' ? '/api' : '/api'

Axios.defaults.baseURL = baseURL
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
 * 同步获取后台返回的数据
 * @param url
 * @param params
 * @returns {Promise}
 */
export function getSync (url, params = {}) {
  let resultData
  $.ajax({
    url: baseURL + url,
    data: params,
    type: 'GET',
    cache: false,
    async: false,
    success: function (data, textStatus) {
      resultData = data
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      if (XMLHttpRequest) {
        handlerError(XMLHttpRequest.status, XMLHttpRequest.responseText.code)
      }
    }

  })
  return resultData
}
/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post (url, data = {}, dataType) {
  return new Promise((resolve, reject) => {
    Axios.post(url, data, dataType)
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

export function put (url, data = {}, dataType) {
  return new Promise((resolve, reject) => {
    Axios.put(url, data, dataType)
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
export function getBaseUrl () {
  return Axios.defaults.baseURL
}
const http = {
  get: get,
  post: post,
  delete: del,
  put: put,
  getSync: getSync,
  getBaseUrl: getBaseUrl
}
export default http
