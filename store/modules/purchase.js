import * as types from '../mutation-types'

const state = {
  purchases: []
}

// mutations
const mutations = {
  // 登录成功
  [types.GET_PURCHASES_SUCCESS] (state, data) {
    state.purchases = data
  }
}

export default {
  mutations,
  state
}
