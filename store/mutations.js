import * as types from './mutation-types'
import {
  unsetToken
} from '~/utils/auth'
export const state = {
  // apiRoot: 'http://106.12.10.77:9090',
  avatarRoot: 'http://pa7c4jxbs.bkt.clouddn.com/',
  articleRoot: 'http://pa8topmtg.bkt.clouddn.com/',
  token: '',
  user: {},
  snackbar: {
    timeout: 4000,
    show: false,
    color: 'green',
    message: ''
  },
  headerActive: 0
}

export const mutations = {
  [types.SET_USER] (state, data) {
    state.user = data || {}
  },
  [types.SET_TOKEN] (state, data) {
    state.token = data || {}
  },
  [types.LOGOUT] (state, data) {
    state.user = {}
    state.token = {}
    unsetToken()
  },
  [types.REGISTER_SUCCESS] (state, data) {
    // state.token = data.token
  },
  [types.ACTIVE_HEADER] (state, index) {
    state.headerActive = index
  },
  [types.INFO] (state, text) {
    state.snackbar = {
      show: true,
      color: 'deep-orange lighten-1',
      message: text
    }
    // setTimeout((state) => {
    //     this.$store.state.snackbar.show = false
    // }, 4000)
  },
  [types.ERROR] (state, text) {
    state.snackbar = {
      show: true,
      color: 'red lighten-1',
      message: text
    }
  },
  [types.SUCCESS] (state, text) {
    state.snackbar = {
      show: true,
      color: 'green lighten-1',
      message: text
    }
  }

}
