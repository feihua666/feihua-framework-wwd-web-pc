import Vuex from 'vuex'
import Vue from 'vue'
import Cookies from 'js-cookie'
Vue.use(Vuex)
/*
let defaultLoginUser = {
  account: null,
  gender: null,
  nickname: null,
  roles: []
}
*/
export default new Vuex.Store({
  state: {
    // 用户登录信息
    loginUser: null,
    // 字典
    dict: {},
    // regexp 正则表达式 是一个对象
    regExp: null,
    // 用户登录token
    token: null,
    // 语言
    lang: Cookies.get('lang') || 'zh',
    // 首页菜单与tabs相关
    indexView: {
      // 访问的标签页数据
      visitedViews: [],
      // 这个属性是一个控制属性，暂时遇到的问题是点击列表中编辑的时候，不是用的弹窗形式，是新加的tab页形式，点击列表中的编辑会由于参数不同但vue重用组件的问题导致数据刷新不对，
      // 所以用户控制一下
      loadDataControl: []
    }
  },
  getters: {
    dataControl: state => state.indexView.loadDataControl,
    visitedViews: state => state.indexView.visitedViews,
    regExp: state => state.regExp,
    loginUser: state => state.loginUser
  },
  mutations: {
    // 设置用户登录token
    setToken: (state, token) => {
      state.token = token
    },
    // 设置登录用户信息
    setLoginUser: (state, loginUser) => {
      state.loginUser = loginUser
    },
    // 设置登录用户信息
    setLoginUserPhoto: (state, photo) => {
      state.loginUser.photo = photo
    },
    // 设置语言
    setLang: (state, lang) => {
      state.lang = lang
      Cookies.set('lang', lang)
    },
    // 添加访问tabs
    addVisitedViews: (state, view) => {
      // 如果已经访问过该view不添加
      if (state.indexView.visitedViews.some(v => v.id === view.id)) {
      } else {
        // 添加一个tab页
        state.indexView.visitedViews.push({
          name: view.name,
          path: view.path,
          id: view.id
        })
      }
    },
    // 关闭一个tab页
    delVisitedViews: (state, view) => {
      for (const [i, v] of state.indexView.visitedViews.entries()) {
        if (v.id === view.id) {
          // 在vue中要删除一个数组一项要使用下面的方式
          state.indexView.visitedViews.splice(i, 1)
          break
        }
      }
    },
    // 关闭所有tab页
    delVisitedViewsAll: (state) => {
      state.indexView.visitedViews.splice(0, state.indexView.visitedViews.length)
    },
    // 关闭除当前页的所有tab页
    delVisitedViewsOthers: (state, view) => {
      let index = -1
      for (const [i, v] of state.indexView.visitedViews.entries()) {
        if (v.id === view.id) {
          index = i
          break
        }
      }
      if (index > -1) {
        state.indexView.visitedViews.splice(0, index)
        state.indexView.visitedViews.splice(1, state.indexView.visitedViews.length - 1)
      }
    },
    addDataControl: (state, value) => {
      state.indexView.loadDataControl.push(value)
    },
    delDataControl: (state, value) => {
      let index = state.indexView.loadDataControl.indexOf(value)
      state.indexView.loadDataControl.splice(index, 1)
    },
    addDict: (state, dict) => {
      state.dict[dict.type] = dict.dicts
    },
    // 设置正则表达诫列表
    setRegExp: (state, regExp) => {
      state.regExp = regExp
    }
  }
})
