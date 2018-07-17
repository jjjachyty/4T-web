/**
 * Created by Janly on 2017/2/8.
 */
import Vue from 'vue'
import Vuex from 'vuex'
/** cust modules */
import User from './modules/user'
import Article from './modules/article'
import Purchase from './modules/purchase'

import actions from './actions'
import * as getters from './getters'
import {
  state,
  mutations
} from './mutations'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
const store = () => new Vuex.Store({
  state,
  actions,
  mutations,
  getters,

  modules: {
    /** cust modules */
    User,
    Article,
    Purchase

  },
  // strict: debug,
  plugins: []
})
export default store
