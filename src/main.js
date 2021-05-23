import Vue from 'vue'
import App from './App.vue'
import store from './store'
import Ws from './plugins/ws'

Vue.use(Ws)
Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
