import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

var vue = new Vue({
  el: '#app',
  render: h => h(App),
})
