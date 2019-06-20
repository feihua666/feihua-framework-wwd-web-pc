// const host = 'http://yangwei.ngrok.ahbdz.com'
const host = ''
const hostApi = host + '/api'
const config = {
  // 请求地址
  host: host,
  // 请求前缀
  hostApi: hostApi,
  // 文件上传下载配置
  file: {
    // 文件上传地址
    uploadUrl: hostApi + '/upload/file',
    // 文件下载地址
    downloadUrl: hostApi + '/file',
    getDownloadUrl: function (path) {
      if (path) {
        if (path.indexOf('http') === 0) {
          return path
        } else {
          return this.downloadUrl + path
        }
      }
      return ''
    }
  },
  // 这里后端会加客户端配置
  client: 'pc',
  // 百度地图ak
  bMapAk: '69a5a1e7260cd2cd298c33666e436530',
  // 系统名称
  systemName: 'fh-framework',
  // logo 的图片地址，不填写使用默认的
  logoUrl: null,
  // 页面向导配置
  guideDriver: {
    doneBtnText: '完成',
    closeBtnText: '我知道了',
    nextBtnText: '下一步',
    prevBtnText: '上一步',
    allowClose: true,
    showButtons: true
  }
}
export default config
