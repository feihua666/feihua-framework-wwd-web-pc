import Axios from 'axios'
const downloadUrl = Axios.defaults.baseURL + '/file'
const config = {
  file: {
    // 文件上传地址
    uploadUrl: Axios.defaults.baseURL + '/upload/file',
    // 文件下载地址
    downloadUrl: downloadUrl,
    getDownloadUrl: function (path) {
      if (path) {
        if (path.indexOf('http') === 0) {
          return path
        } else {
          return downloadUrl + path
        }
      }
      return downloadUrl
    }
  },
  httpBaseURL: Axios.defaults.baseURL
}
export default config
