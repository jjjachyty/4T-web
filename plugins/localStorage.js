import createPersistedState from 'vuex-persistedstate'

export default ({
  store
}) => {
  createPersistedState({
    reducer (state, paths) {
      // No need to use let as the reducer itself can be immutable which do not mean that the properties
      // are not mutable (https://ponyfoo.com/articles/var-let-const)
      const reducer = Object.assign({}, state)
      // state which you don't want to persist.
      delete reducer.snackbar
      delete reducer.apiRoot
      delete reducer.articleRoot
      return reducer
    },
    filter (value) {
      console.log('value.payload', value)

      if ({
        'ACTIVE_HEADER': true,
        'REGISTER_SUCCESS': true,
        'LOGIN_SUCCESS': true,
        'LOGOUT': true,
        'GET_USER_PROFILE_SUCCESS': true,
        'REFRESH_USER': true
      }[value.type]) {
        console.log(true)

        return true
      } else {
        console.log(false)

        return false
      }
    }
  })(store)
}
