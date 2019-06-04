/* eslint-disable no-console */
import Vuex from 'vuex'
import md5 from 'md5'
import db from '@/plugins/firestore'
import { saveUserData, clearUserData } from '@/utils'

const createStore = () => {
  return new Vuex.Store({
    state: {
      headlines: [],
      category: '',
      loading: false,
      country: 'mx',
      token: null,
      user: null,
      feed: []
    },
    mutations: {
      setHeadlines(state, headlines) {
        state.headlines = headlines
      },
      setCategory(state, category) {
        state.category = category
      },
      setLoading(state, loading) {
        state.loading = loading
      },
      setCountry(state, country) {
        state.country = country
      },
      setToken(state, token) {
        state.token = token
      },
      setUser(state, user) {
        state.user = user
      },
      setFeed(state, headlines) {
        state.feed = headlines
      }
    },
    actions: {
      async loadHeadlines({ commit }, apiUrl) {
        commit('setLoading', true)
        const { articles } = await this.$axios.$get(apiUrl)
        commit('setHeadlines', articles)
        commit('setLoading', false)
      },
      async addHeadlineToFeed({ state, commit }, headline) {
        const feedRef = db
          .collection(`users/${state.user.email}/feed`)
          .doc(headline.title)
        await feedRef.set(headline)
      },
      async loadUserFeed({ state, commit }) {
        if (state.user) {
          const feedRef = db.collection(`users/${state.user.email}/feed`)
          await feedRef.onSnapshot((querySnapshot) => {
            const headlines = []
            querySnapshot.forEach((doc) => {
              headlines.push(doc.data())
            })
            commit('setFeed', headlines)
          })
        }
      },
      async authenticateUser({ commit }, userPayload) {
        try {
          commit('setLoading', true)
          const authUserData = await this.$axios.$post(`/${userPayload.action}/`, {
            email: userPayload.email,
            password: userPayload.password,
            returnSecureToken: userPayload.returnSecureToken
          })
          let user
          if (userPayload.action === 'register') {
            const avatar = `http://gravatar.com/avatar/${md5(authUserData.email)}?d=identicon`
            user = { email: authUserData.email, avatar }
            await db.collection('users').doc(userPayload.email).set(user)
          } else {
            const loginRef = db.collection('users').doc(userPayload.email)
            const loggedUser = await loginRef.get()
            user = loggedUser.data()
          }
          commit('setUser', user)
          commit('setToken', authUserData.idToken)
          commit('setLoading', false)
          saveUserData(authUserData, user)
        } catch (error) {
          console.log(error)
          commit('setLoading', false)
        }
      },
      setLogoutTimer({ dispatch }, payload) {
        setTimeout(() => dispatch('logoutUser'), payload)
      },
      logoutUser({ commit }) {
        commit('setFeed', [])
        commit('setToken', null)
        commit('setUser', null)
        clearUserData()
      }
    },
    getters: {
      headlines: state => state.headlines,
      category: state => state.category,
      isAuthenticated: state => !!state.token,
      loading: state => state.loading,
      country: state => state.country,
      user: state => state.user,
      userFeed: state => state.feed
    }
  })
}

export default createStore
