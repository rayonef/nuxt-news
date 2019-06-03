import firebase from 'firebase/app'
import 'firebase/firestore'

if (!firebase.apps.length) {
  const firebaseConfig = {
    apiKey: 'AIzaSyBniHm-iMtplIz4ZsXV8DKXyRhREdHv3yI',
    authDomain: 'nuxt-news-b7d31.firebaseapp.com',
    databaseURL: 'https://nuxt-news-b7d31.firebaseio.com',
    projectId: 'nuxt-news-b7d31',
    storageBucket: 'nuxt-news-b7d31.appspot.com',
    messagingSenderId: '644192241262',
    appId: '1:644192241262:web:ae1361de4b798514'
  }
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig)
  firebase.firestore().settings({
    timestampsInSnapshots: true
  })
}

const db = firebase.firestore()

export default db
