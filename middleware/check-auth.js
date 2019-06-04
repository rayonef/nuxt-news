/* eslint-disable */
import { getUserFromCookie, getUserFromLocalStorage } from '@/utils'

export default function ({ store, req }) {
  if (process.server && !req) return

  const userData = process.server ? getUserFromCookie(req) : getUserFromLocalStorage()
  console.log(userData)
  if (!userData) {
    return
  } else if (!userData.jwt || Date.now() > userData.expiresIn) {
    store.commit('setToken', null)
    store.commit('setUser', null)
  } else {
    store.commit('setToken', userData.jwt)
    store.commit('setUser', userData.user)
    const timeToLogout = userData.expiresIn - Date.now()
    store.dispatch('setLogoutTimer', timeToLogout)
  }
}
