<template>
  <div class="table">
    <div class="table__container">
      <div class="table-head">
        <div class="table-head__row head-row">
          <div class="head-row__td-name table-cell">ПАРАМЕТР</div>
          <div class="head-row__td-name table-cell">ЗНАЧЕНИЕ</div>
        </div>
      </div>

      <div class="table-body">
        <div class="table-body__scroll">
          <div class="table-body__row" v-for="(item, itemIndex) of tableData" :key="item.name">
            <div class="main-row">
              <div class="main-row__cell-params table-cell">
                <span class="main-row__cell-name">{{
                  `${item.name}${item.measureUnit ? ', ' + item.measureUnit : ''}`
                }}</span>
                <br />
                <span class="main-row__cell-description">{{ item.description }}</span>
              </div>
              <div class="table-cell">
                <span
                  :class="
                    editableItemIndex === itemIndex
                      ? 'main-row__cell-value main-row__cell-value_active'
                      : 'main-row__cell-value'
                  "
                  >{{ item.value }}</span
                >
              </div>
              <div class="table-cell">
                <div @click="toggleEditor({ item, itemIndex })">
                  <svg
                    :class="editableItemIndex === itemIndex ? 'edit-icon edit-icon_active' : 'edit-icon'"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 0 24 24"
                    width="24px"
                  >
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path
                      d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"
                    />
                  </svg>
                </div>
              </div>
              <div @click="toggleDropdown(itemIndex)" class="table-cell">
                <img
                  v-if="item.relations && dropdownIndex !== itemIndex"
                  src="../assets/arrow-down.svg"
                  alt="array down"
                />
                <img
                  v-if="item.relations && dropdownIndex === itemIndex"
                  src="../assets/arrow-up.svg"
                  alt="array up"
                />
              </div>
            </div>
            <div class="table-body__row" v-if="dropdownIndex === itemIndex">
              <div
                class="relation-row"
                v-for="(relation, relationIndex) of item.relations"
                :key="relation.name"
              >
                <div class="relation-row__cell-params table-cell">
                  <div class="relation-row__cell-name">
                    {{
                      `${relation.name}${relation.measureUnit ? ', ' + relation.measureUnit : ''}`
                    }}
                  </div>
                  <div class="relation-row__cell-value">{{ relation.value }}</div>
                </div>
                <div
                  @click="toggleEditor({ item, relation, itemIndex, relationIndex })"
                  class="table-cell"
                >
                  <svg
                    :class="editableRelationIndex === relationIndex ? 'edit-icon edit-icon_active' : 'edit-icon'"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 0 24 24"
                    width="24px"
                  >
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path
                      d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="table-overlay" @click="closeEditPopup" v-show="editPopup"></div>
      <div class="table-edit-popup edit-popup" v-show="editPopup">
        <div class="edit-popup__container">
          <div class="checkbox" v-if="editData.possibleValues">
            <div class="chek" v-for="posible of editData.possibleValues" :key="posible.description">
              <input type="radio" :value="posible.description" :id="posible.description" v-model="editData.value"/>
              <label :for="posible.description">{{posible.description}}</label>  
            </div>
                    
          </div>
          <input class="edit-popup__input" v-else type="number" @keypress.enter="editParam" v-model="editData.value" />
          <div class="edit-popup__btns">
            <button  class="edit-popup__btn" @click="closeEditPopup">Отменить</button>
            <button  class="edit-popup__btn" @click="editParam">Редактировать</button>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Table',
  data: () => ({
    editableItemIndex: null,
    editableRelationIndex: null,
    dropdownIndex: null,
    editPopup: false,
    editData: {},
  }),
  computed: {
    ...mapGetters({
      tableData: 'GET_TABLE_DATA',
    }),
  },
  methods: {
    ...mapMutations([
      'UPDATE_TABLE_DATA_ITEM',
      'UPDATE_TABLE_DATA_RELATION'
    ]),
    toggleDropdown(index) {
      if (this.dropdownIndex === index) this.dropdownIndex = null
      else this.dropdownIndex = index
    },
    toggleEditor({ item, relation, itemIndex, relationIndex }) {
      this.editPopup = true
      if (relationIndex === undefined) {
        this.editData = {...item}
        this.editableItemIndex = this.editableItemIndex === itemIndex ? null : itemIndex
      } else {
        this.editData = {...relation}
        this.editableItemIndex = itemIndex
        this.editableRelationIndex = this.editableRelationIndex === relationIndex ? null : relationIndex
      }
    },
    closeEditPopup() {     
      this.editPopup = false
      this.editData = {}
      this.editableItemIndex = null
      this.editableRelationIndex = null
    },

    editParam() {
      if (this.editableRelationIndex === null) {
        this.UPDATE_TABLE_DATA_ITEM({value: this.editData.value, index: this.editableItemIndex})
      } else {
        this.UPDATE_TABLE_DATA_RELATION({
          value: this.editData.value,
          index: this.editableItemIndex,
          indexRelation: this.editableRelationIndex
        })
      }

      this.$ws.send(JSON.stringify({name: this.editData.name, value: this.editData.value}))
      this.closeEditPopup()      
    },
  },
}
</script>

<style lang="sass">

::-webkit-scrollbar
  width: 5px

::-webkit-scrollbar-thumb
  background: #63a3d4

::-webkit-scrollbar-thumb:hover
  border-width: 1px 1px 1px 2px
  background: #63a3d4


::-webkit-scrollbar-track
  background: #f1f1ef
  border-radius: 5px

.table
  border-spacing: 0

  &__container
    box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2)
    max-width: 800px
    position: relative
    margin: 0 auto
    margin-top: 50px

  &-body
    &__scroll
      max-height: 70vh
      overflow-y: scroll
      overflow-x: hidden

  &-cell
    padding: 10px

  &-head__row
    background-color: #f1f1ef
    color: #878887
    font-size: 14px
    letter-spacing: 2px
    font-weight: 200
    display: flex
  
  &-overlay
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: #000
    opacity: 0.3


.edit-popup
  box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2)
  position: absolute
  top: calc(50% - 60px)
  left: calc(50% - 160px)
  width: 300px
  height: 100px
  background-color: #fff
  border-radius: 10px
  padding: 10px

  &__container
    height: 100%
    display: flex
    flex-direction: column
    align-items: center
    justify-content: space-around

  &__input
    border: none
    border-bottom: 1px solid #878887
    padding: 5px 10px
    outline: none
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button 
      -webkit-appearance: none
    
    &:hover
      border-bottom: 1px solid #000


  &__btns
    width: 100%
    display: flex
    justify-content: space-around

  &__btn
    color: #878887
    box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2)
    padding: 5px
    border-radius: 5px
    min-width: 100px
    background-color: #fff

    border: none
    &:hover
      box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.4)    

.edit-icon
  fill: #000000
  &_active
    fill: #609bce

.head-row
  display: grid
  grid-template-columns: minmax(100px, 1fr) minmax(200px, 1fr) 40px 40px

.main-row
  display: grid
  grid-template-columns: minmax(100px, 1fr) minmax(200px, 1fr) 40px 40px
  border-bottom: 1px solid #e6e6e7
  align-items: center

  &:hover
    background-color: #eff6fb

  &__cell-value
    max-width: 70px
    padding: 5px
    display: flex
    align-items: center
    justify-content: center
    background-color: transparent
    border-radius: 5px
    font-weight: 600
    &_active
      background-color: #f1f1ef

  &__cell-name
    font-weight: 600

  &__cell-description
    font-size: 14px
    color: #878887
    font-weight: 200

.relation-row
  display: grid
  grid-template-columns: minmax(100px, 1fr) minmax(200px, 1fr) 40px 40px
  background-color: #f1f1ef

  &__cell-params
    grid-column-start: 2
    grid-column-end: 3
    display: flex
    justify-content: space-between

  &__cell-name
    font-weight: 600

  &__cell-value
    max-width: 70px
    min-width: 50px
    padding: 5px
    display: flex
    align-items: center
    justify-content: center
    background-color: #fff
    border-radius: 5px
    font-weight: 600

.edit-btn
  color: #000
</style>
