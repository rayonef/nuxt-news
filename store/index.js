/* eslint-disable no-console */
import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      headlines: [],
      category: '',
      loading: false,
      country: 'mx',
      token: null
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
      }
    },
    actions: {
      async loadHeadlines({ commit }, apiUrl) {
        commit('setLoading', true)
        const { articles } = await this.$axios.$get(apiUrl)
        commit('setHeadlines', articles)
        commit('setLoading', false)
      },
      async authenticateUser({ commit }, userPayload) {
        try {
          commit('setLoading', true)
          const authUserData = await this.$axios.$post('/register/', userPayload)
          commit('setToken', authUserData.idToken)
          commit('setLoading', false)
        } catch (error) {
          console.log(error)
          commit('setLoading', false)
        }
      }
    },
    getters: {
      headlines: state => state.headlines,
      category: state => state.category,
      isAuthenticated: state => !!state.token,
      loading: state => state.loading,
      country: state => state.country
    }
  })
}

export default createStore
