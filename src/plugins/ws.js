export default {
  install(Vue, options = {}) {
    Vue.prototype.$ws = new WebSocket(`ws://localhost:3000`)
  }
}

