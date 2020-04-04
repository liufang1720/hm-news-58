import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,
  state: {
    // 需要被keep-alive缓存的一个数组
    cacheList: [],
  },
  mutations: {
    // 缓存组件
    cache(state, name) {
      if (!state.cacheList.includes(name)) {
        state.cacheList.push(name)
      }
    },
    //不需要缓存的组件
    uncache(state, name) {
      if (state.cacheList.includes(name)) {
        state.cacheList = state.cacheList.filter((item) => item !== name)
      }
    },
  },
})

export default store
