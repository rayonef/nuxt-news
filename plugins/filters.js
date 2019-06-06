import Vue from 'vue'
import moment from 'moment'

Vue.filter('prettyDate', val => moment(val).format('L'))
Vue.filter('prettyDateWithTime', (val) => {
  const date = moment(val).format('DD/MM/YY')
  const time = moment(val).format('HH:mm')
  return `${date} ${time}`
})
Vue.filter('timeAgo', (val) => {
  // const fromNow = moment(val).subtract(30, 'seconds').fromNow();
  return moment(val).fromNow()
})
