import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tableData: {},
    loading: true
  },

  getters: {
    GET_LOADING: ({ loading }) => loading,
    GET_TABLE_DATA: ({ tableData }) => tableData
  },

  mutations: {
    SET_TABLE_DATA(state, payload){
      state.tableData = payload
    },
    SET_LOADING(state, payload){
      state.loading = payload
    },
    UPDATE_TABLE_DATA_ITEM(state, {value, index}){
      let newTableData = state.tableData[index]
      newTableData.value = value
      state.tableData.splice(index, 1, newTableData)
    },
    UPDATE_TABLE_DATA_RELATION(state, {value, index, indexRelation}){      
      let newTableData = state.tableData[index]
      let newTableDataRelation = newTableData.relations[indexRelation]   
      newTableDataRelation.value = value
      newTableData.relations.splice(indexRelation, 1, newTableDataRelation)
      state.tableData.splice(index, 1, newTableData)
    }
  },

  actions: {},
})