import { getUserFromCookie, getUserFromLocalStorage, getTokenFromCookie, getTokenFromLocalStorage } from '~/utils/auth'

export default function ({ isServer, store, req }) {
  // If nuxt generate, pass this middleware
  if (isServer && !req) return
  const loggedUser = isServer ? getUserFromCookie(req) : getUserFromLocalStorage()
  const token = isServer ? getTokenFromCookie(req) : getTokenFromLocalStorage()

  store.commit('SET_USER', loggedUser)
  store.commit('SET_TOKEN', token)
}
