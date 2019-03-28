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
    // 语言,暂时没有用到
    lang: Cookies.get('lang') || 'zh',
    // 首页菜单与tabs相关
    indexView: {
      // 访问的标签页数据
      visitedViews: []
    }
  },
  getters: {
    dataControl: state => state.indexView.loadDataControl,
    visitedViews: state => state.indexView.visitedViews,
    loginUser: state => state.loginUser
  },
  mutations: {
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
    }
  }
})
