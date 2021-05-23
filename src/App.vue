<template>
  <div id="app">
    <Table/>
    <loader/>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

import Table from './components/Table'
import Loader from './components/Loader'
export default {
  name: 'App',
  components: {
    Table,
    Loader,
  },
  data: () => ({
    wsConnected: false,
  }),
  methods: {
    ...mapMutations([
      'SET_LOADING',
      'SET_TABLE_DATA',
    ])
  },
  created() {
    const startWs = ()=>{
      this.$ws.onopen = (event) => {
        console.log(`WebSocket is open`)
        this.wsConnected = true
      }
      this.$ws.onclose = (event) => {
        console.log(`WebSocket is closed`)
        this.wsConnected = false
        this.SET_LOADING(true)
        this.$ws.close()

        setTimeout(()=>{
          console.log(`WebSocket is reconnecting`)
          this.$ws = new WebSocket(`ws://localhost:3000`)
          startWs()          
        }, 5000)
      }
      this.$ws.onmessage = (event) => {
        console.log(`WebSocket have message`)
        if (!event.data) return
        this.SET_LOADING(false)
        this.SET_TABLE_DATA(JSON.parse(event.data))
      }
      this.onerror = (error) => {
        console.log(`WebSocket have error`, error)
        this.$ws.close()
      }
    }

    startWs()
    this.isLoading = true
  },
}
</script>

<style lang="sass">
.app
  position: relative
</style>
