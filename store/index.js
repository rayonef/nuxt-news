/* eslint-disable no-console */
import md5 from 'md5'
import slugify from 'slugify'
import db from '@/plugins/firestore'
import { saveUserData, clearUserData } from '@/utils'
import defaulImage from '@/assets/no-image.jpg'

export const state = () => ({
  headlines: [],
  category: '',
  loading: false,
  country: 'mx',
  token: null,
  user: null,
  feed: [],
  headline: null,
  source: ''
})

export const mutations = {
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
  },
  setHeadline(state, headline) {
    state.headline = headline
  },
  setSource(state, source) {
    state.source = source
  }
}

export const actions = {
  async loadHeadlines({ commit }, apiUrl) {
    commit('setLoading', true)
    const { articles } = await this.$axios.$get(apiUrl)
    const headlines = articles.map((article) => {
      const slug = slugify(article.title, {
        replacement: '-',
        remove: /[^a-zA-Z0-9 -]/g,
        lower: true
      })
      if (!article.urlToImage) {
        article.urlToImage = defaulImage
      }
      const headline = { ...article, slug }
      return headline
    })
    commit('setHeadlines', headlines)
    commit('setLoading', false)
  },
  async likeComment({ state, commit }, commentId) {
    const commentsRef = db.collection(`headlines/${state.headline.slug}/comments`)
      .orderBy('likes', 'desc')
    const likedCommentRef = db.collection('headlines').doc(state.headline.slug)
      .collection('comments').doc(commentId)
    await likedCommentRef.get().then((doc) => {
      if (doc.exists) {
        const prevLikes = doc.data().likes
        const currentLikes = prevLikes + 1
        likedCommentRef.update({
          likes: currentLikes
        })
      }
    })

    await commentsRef.onSnapshot((querySnapshot) => {
      const loadedComments = []
      querySnapshot.forEach((doc) => {
        loadedComments.push(doc.data())
      })
      const upddatedHeadline = {
        ...state.headline,
        comments: loadedComments
      }
      commit('setHeadline', upddatedHeadline)
    })
  },
  async loadHeadline({ commit }, slug) {
    const headlineRef = db.collection('headlines').doc(slug)
    const commentsRef = db.collection(`headlines/${slug}/comments`)

    let loadedHeadline = {}
    await headlineRef.get().then(async (doc) => {
      if (doc.exists) {
        loadedHeadline = doc.data()
        await commentsRef.orderBy('likes', 'desc').get().then((querySnapshot) => {
          if (querySnapshot.empty) {
            commit('setHeadline', loadedHeadline)
          }
          const loadedComments = []
          querySnapshot.forEach((doc) => {
            loadedComments.push(doc.data())
          })
          loadedHeadline.comments = loadedComments
          if (!loadedHeadline.urlToImage) {
            loadedHeadline.urlToImage = defaulImage
          }
          commit('setHeadline', loadedHeadline)
        })
      }
    })
  },
  async addHeadlineToFeed({ state }, headline) {
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
  async saveHeadline({ commit }, headline) {
    const headlineRef = db.collection('headlines').doc(headline.slug)
    let headlineId
    await headlineRef.get().then((doc) => {
      if (doc.exists) {
        headlineId = doc.id
      }
    })

    if (!headlineId) {
      await headlineRef.set(headline)
    }
  },
  async removeHeadlineFromFeed({ state }, headline) {
    const headlineRef = db.collection(`users/${state.user.email}/feed`).doc(headline.title)
    await headlineRef.delete()
  },
  async sendComment({ commit, state }, comment) {
    const commentsRef = db.collection(`headlines/${state.headline.slug}/comments`)

    commit('setLoading', true)
    await commentsRef.doc(comment.id).set(comment)
    await commentsRef.orderBy('likes', 'desc').get().then((querySnapshot) => {
      const comments = []
      querySnapshot.forEach((doc) => {
        comments.push(doc.data())
      })
      const updatedHeadline = { ...state.headline, comments }
      commit('setHeadline', updatedHeadline)
    })
    commit('setLoading', false)
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
}

export const getters = {
  headlines: state => state.headlines,
  category: state => state.category,
  isAuthenticated: state => !!state.token,
  loading: state => state.loading,
  country: state => state.country,
  user: state => state.user,
  userFeed: state => state.feed,
  headline: state => state.headline,
  source: state => state.source
}
