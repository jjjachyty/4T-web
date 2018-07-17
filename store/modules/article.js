import * as types from '../mutation-types'

const state = {
  articles: []
}

// mutations
const mutations = {
  // 登录成功
  [types.GET_ARTICLES_SUCCESS] (state, data) {
    state.articles = data
  }
}

export default {
  mutations,
  state
}
