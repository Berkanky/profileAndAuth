<template>
  <q-card
    style="margin:0 auto;"
    :style="{
      'width':this.store.mobileActive ? '100%' : '600px'
    }"
  >
    <q-card-section class="row">
      <transition-group appear enter-active-class="animated fadeInLeft slower" leave-active-class="animated fadeOutRight slower">
        <q-card
          draggable="true"
          @dragstart="onDragStart(data)"
          v-on:click="console.log(data)"
          :class="this.newCardClass(data)"
          v-on:mouseover="mouseOver(data)"
          v-on:mouseleave="mouseLeave(data)"
          style="border-radius:15px;"
          v-for="(data,key) in this.searchingPositions" :key="key" class="col-3 q-ma-xs">
          <q-card-section class="text-center text-capitalize">
           <div>
            {{ data.positionName ?? '' }}
           </div>
           <q-space></q-space>
           <div v-if="this.checkForDeleteList(data)">
            <q-icon name="check" flat color="red-4" size="xs"></q-icon>
           </div>
          </q-card-section>
        </q-card>
      </transition-group>
    </q-card-section>
    <q-card-section
      @dragover.prevent
      @dragleave.prevent
      @drop="onDrop(e)"
      class="text-center bg-red-1" style="border-radius:15px;">
      <q-card
        flat
        style="border-radius:15px;"
        class="bg-transparent q-mt-xs"
        v-for="(data,key) in this.deleteList" :key="key">
          <q-card-section horizontal>
            <q-card-section class="col text-left text-capitalize text-grey-8 text-weight-bold">
              <div>
                <q-icon name="info"></q-icon>
                {{ data.positionName }}
              </div>
          </q-card-section>
          <q-card-section class="col-2">
            <q-btn icon="remove" flat color="dark" v-on:click="removeFromDeleteList(data)"></q-btn>
          </q-card-section>
          </q-card-section>
      </q-card>
      <q-btn
        :disable="this.deleteList.length ? false : true"
        icon="delete_forever" flat color="red-4" no-caps label="Scroll For Remove" class="q-mt-md" v-on:click="deleteSelecteds"></q-btn>
    </q-card-section>
    <q-card-section>
      <q-input
        v-on:keyup.enter="this.addPosition()"
        color="grey-8"
        filled v-model="this.positionData.positionName" label="Add Position"
      >
        <template v-slot:prepend>
          <q-icon name="add"></q-icon>
        </template>
        <template v-slot:append>
          <q-btn icon="remove" flat color="red-4" v-if="this.positionData.positionName" v-on:click="delete this.positionData.positionName"></q-btn>
        </template>
        <template v-slot:after>
          <q-btn icon="add" color="green-4" v-if="this.positionData.positionName" v-on:click="addPosition"></q-btn>
        </template>
      </q-input>
    </q-card-section>
    <q-card-section horizontal class="q-pa-md">
        <q-btn
          v-on:click="this.store.currentStep = this.store.currentStep - 1"
          class="col" flat color="grey-8" label="Back" no-caps
          icon="arrow_left"></q-btn>
        <q-btn
          v-on:click="this.store.currentStep = this.store.currentStep + 1"
          icon-right="arrow_right" flat color="grey-8" label="Next" no-caps class="col"></q-btn>
      </q-card-section>
  </q-card>
</template>

<script>
import axios from 'axios';
import { useCounterStore } from 'src/stores/store';
export default {
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      positionData:{},
      searchingPositions:[],
      mouseOverData:{},
      deleteList:[],
      draggedPosition:{}
    }
  },
  methods:{
    mouseLeave(data){
      this.mouseOverData = {}
    },
    checkForDeleteList(data){
      const check = this.deleteList.some(
        object => object._id === data._id
      )
      return check
    },
    deleteSelecteds(){
      console.log(this.deleteList)
      const allBody = {
        deleteList:this.deleteList
      }
      ///:firebaseId/deleteSelectedSearchingPositions
      const url = this.store.baseUrl
      const fid = this.store.firebaseData.uid
      console.log(url,fid)
      axios.put(`${url}/app/${fid}/deleteSelectedSearchingPositions`, allBody)
        .then(res => {
          console.log(res)

          this.searchingPositions.forEach(element => {
            const result = this.deleteList.find(
              object => object._id === element._id
            )
            if(result){
              this.searchingPositions = this.searchingPositions.filter(
                object => object._id !== result._id
              )
            }
            this.getMyPositions()
            this.deleteList = []
          });

        })
        .catch(err => {
          console.log(err)
        })
    },
    removeFromDeleteList(data){
      this.deleteList = this.deleteList.filter(
        object => object._id !== data._id
      )
    },
    onDrop() {
      console.log('yoooooooooo')
      const result = this.searchingPositions.find(
        object => object._id === this.draggedPosition._id
      )
      if(result){
        const check = this.deleteList.some(
          object => object._id === this.draggedPosition._id
        )
        if(!check){
          this.deleteList.push(this.draggedPosition)
        }else{
          //
        }
      }

      console.log(this.deleteList)
    },
    onDragStart (data) {
      console.log(data)
      this.draggedPosition = data
    },
    mouseLeave(data){
      this.mouseOverData = {}
    },
    newCardClass(data){
      const firstCheck = this.mouseOverData.hasOwnProperty('_id')
      if(firstCheck){
        const check = this.mouseOverData._id === data._id ? true : false
        if(check){
          return 'bg-grey-8 text-white'
        }else{
          return ''
        }
      }else{
        return ''
      }
    },
    mouseOver(data){
      this.mouseOverData = data
    },
    getMyPositions(){
      ///:firebaseId/getMyPositions
      axios.get(`${this.store.baseUrl}/app/${this.store.firebaseData.uid}/getMyPositions`)
        .then(res=>{
          console.log(res)
          this.searchingPositions = res.data.searchingPositions
        })
        .catch(err => {
          console.log(err)
        })
    },
    addPosition(){
      if(this.positionData.positionName){
        const allBody = {
          positionData:this.positionData
        }
        ///:firebaseId/addPosition
        axios.put(`${this.store.getGlobalInfos().url}/app/${this.store.getGlobalInfos().fid}/addPosition`, allBody)
          .then(res => {
            console.log(res)
            Object.assign(this.store.myData,res.data.findme)
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  },
  created(){
    this.getMyPositions()
    this.$watch('store.myData',(newVal) => {
      if(newVal){
        this.getMyPositions()
      }
    },
    {
      immediate:true, deep:true
    })
    console.log(this.store.getGlobalInfos())
  }
}
</script>

<style>

</style>
