import * as types from './mutation-types'

export const state = {
  // apiRoot: 'http://106.12.10.77:9090',
  // avatarRoot: 'http://pa7c4jxbs.bkt.clouddn.com/',
  articleRoot: 'http://pa8topmtg.bkt.clouddn.com/',
  auth: {
    token: '',
    expire: {}
  },
  snackbar: {
    timeout: 4000,
    show: false,
    color: 'green',
    message: ''
  },
  headerActive: 0
}

export const mutations = {
  [types.LOGIN_SUCCESS] (state, data) {
    state.auth.token = data.token
    state.auth.expire = data.expire
  },
  [types.LOGOUT] (state, data) {
    console.log('LOGOUT', state)
    state.auth.token = ''
    state.auth.expire = {}
    state.User.user = {}
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
