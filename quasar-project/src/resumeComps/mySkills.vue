<template>
  <q-card
  class="q-pa-sm"
  :style="{
    'width':this.store.mobileActive ? '100%' : '600px',
    'margin':this.store.mobileActive ? '0 auto' : '0% auto',
    'height':this.$q.screen.height + 'px'
  }"
  >
    <q-input
      v-if="this.mySkills.length"
      v-model="this.searchSkill.skillName"
      filled
      color="grey-8"
      class="q-mt-sm"
      label="Search"
      v-on:keyup="seachSkillFunc"
      >
        <template v-slot:prepend>
          <q-icon name="search"></q-icon>
        </template>
        <template v-slot:append>
          <q-btn icon="remove" flat color="red-4" v-if="this.searchSkill.skillName" v-on:click="delete this.searchSkill.skillName"></q-btn>
        </template>
      </q-input>
    <q-card-section class="row">
    <transition-group appear enter-active-class="animated fadeInLeft slower" leave-active-class="animated fadeOutRight slower">
      <q-card
        draggable="true"
        @dragstart="onDragStart(data)"
        v-on:mouseleave="mouseLeaveSkill(data)"
        v-on:mouseover="mouseOnSkill(data)"
        :class="this.checkMouseOnData(data)"
        v-touch-hold:2000.mouse="event => removeSelected(data)"
        v-for="(data,key) in this.mySkills" :key="key"
        style="border-radius:4px;"
        class="col-12 col-md-3 col-sm-3 q-mt-xs">
          <q-item>
            <q-item-section class="text-center text-capitalize">
              <div>
                {{ data.skillName ?? 'No Skill Name' }}
              </div>
            </q-item-section>
            <q-item-section class="text-right">
              <div v-if="this.checkForDeleteList(data)">
                <q-icon name="check" color="red-4"></q-icon>
              </div>
            </q-item-section>
          </q-item>
      </q-card>
    </transition-group>
    </q-card-section>
    <q-card-section
      @dragover.prevent
      @dragleave.prevent
      @drop="onDrop(e)"
      class="bg-red-4" style="border-radius:7px;">
      <q-card
        v-for="(data,key) in this.deleteList" :key="key"
        class="bg-grey-2 text-grey-8 text-weight-bold q-mt-xs"
        style="border-radius:4px;"
      >
        <q-item>
          <q-item-section class="q-pa-md text-capitalize text-left">
          <div class="">
            <q-icon name="info"></q-icon>
            {{ data.skillName ?? '' }}
          </div>
          <div class="text-caption text-weight-bold text-grey-6">
            {{ data.skillAddedDate ?? '' }}
          </div>
        </q-item-section>
        <q-item-section class="text-right">
          <div>
            <q-btn
              v-on:click="removeFromList(data)"
              icon="delete_forever" flat color="red-4"></q-btn>
          </div>
        </q-item-section>
        </q-item>
      </q-card>

      <q-btn
        v-on:click="deleteListClear"
        :disable="this.deleteList.length ? false : true"
        icon="delete_forever" class="full-width q-mt-md q-pa-md" flat
        color="white" no-caps label="Drop for Delete"></q-btn>

    </q-card-section>
    <q-input
      class="q-mt-md"
        filled
        v-on:keyup.enter="this.addSkill()"
        color="grey-8"
        v-model="this.skillData.skillName" label="Skill">
          <template v-slot:prepend>
            <q-icon name="search"></q-icon>
          </template>
          <template v-slot:append>
            <q-btn icon="remove" flat color="red-4" v-if="this.skillData.skillName" v-on:click="delete this.skillData.skillName"></q-btn>
          </template>
          <template v-slot:after>
            <q-btn
              round
              icon="upload" color="blue-4" v-if="this.skillData.skillName" v-on:click="addSkill"></q-btn>
          </template>
        </q-input>
    <q-card-section horizontal class="q-pa-md absolute-bottom">
      <q-btn
        v-on:click="this.store.currentStep = this.store.currentStep - 1"
        class="col" flat color="grey-8" label="Back" no-caps
        icon="arrow_left"></q-btn>
        <q-btn
          class="col"
          label="Next" no-caps
          v-on:Click="this.store.currentStep = this.store.currentStep + 1"
          icon-right="arrow_right" color="grey-8 " flat
        ></q-btn>
    </q-card-section>
  </q-card>
</template>

<script>
import axios from 'axios'
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
      mySkills:[],
      skillData:{},
      mouseOnData:{},
      searchSkill:{},
      deleteList:[],
      draggedPosition:{}
    }
  },
  methods:{
    deleteListClear(){
      const allBody = {
        deleteList:this.deleteList
      }
      const url = this.store.baseUrl
      const fid = this.store.firebaseData.uid
      axios.put(`${url}/app/${fid}/deleteSelectedSkills`, allBody)
        .then( res => {
          console.log(res)

          this.mySkills.forEach(element => {
            const result = this.deleteList.find(
              object => object._id === element._id
            )
            if(result){
              this.mySkills = this.mySkills.filter(
                object => object._id !== result._id
              )
            }
          });


          this.deleteList = []

        })
        .catch( err => {
          console.log(err)
        })

      ///:firebaseId/deleteSelectedSkills
    },
    checkForDeleteList(data){
      const check = this.deleteList.some(
        object => object._id === data._id
      )
      return check
    },
    removeFromList(data){
      this.deleteList = this.deleteList.filter(
        object => object._id !== data._id
      )
    },
    onDrop(e) {
      console.log('yoooooooooo')
      const result = this.mySkills.find(
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
    },
    onDragStart(data){
      this.draggedPosition = data
      console.log('draggedPosition',this.draggedPosition)
    },
    seachSkillFunc(){
      if(this.searchSkill.skillName){
        const allBody = {
          searchSkill:this.searchSkill
        }
        ///:firebaseId/searchSkill
        const url = this.store.baseUrl
        const fid = this.store.firebaseData.uid
        axios.put(`${url}/app/${fid}/searchSkill`, allBody)
          .then( res => {
            console.log(res)
            const lengthVal = res.data.result.length ? true : false
            if(lengthVal){
              this.mySkills = res.data.result
            }else{
              this.$q.notify({
                type:'negative',
                icon:'info',
                message:'Try Again !',
                position:'bottom'
              })
            }
          })
          .catch(err => {
            console.log(err)
          })

      }else{
        const firebaseId = this.store.firebaseData.uid
        this.getMySkills(firebaseId)
      }
    },
    mouseLeaveSkill(data){
      this.mouseOnData = {}
    },
    checkMouseOnData(data){
      const check = this.mouseOnData.hasOwnProperty('_id')
      if(check){
        const newClass = this.mouseOnData._id === data._id ? 'bg-grey-8 text-white' : 'bg-grey-2'
        return newClass
      }else{
        return 'bg-grey-2'
      }
    },
    mouseOnSkill(data){
      console.log(data)
      this.mouseOnData = data
    },
    removeSelected(data){
      console.log(data)
      ///:firebaseId/:selectedSkillId/removeSkill

      this.searchSkill = {}

      const url = this.store.baseUrl
      const fid = this.store.firebaseData.uid
      const sid = data._id

      axios.put(`${url}/app/${fid}/${sid}/removeSkill`)
        .then(res => {
          console.log(res)
          Object.assign(this.store.myData,res.data.findme)
          this.mySkills = this.mySkills.filter(
            object => object._id !== data._id
          )

          const check = this.mySkills.length ? true : false
          if(!check){
            const firebaseId = this.store.firebaseData.uid
            this.getMySkills(firebaseId)
          }

        })
        .catch(err => {
          console.log(err)
        })

    },
    addSkill(){
      console.log(this.skillData)

      if(this.skillData.skillName){
        const allBody = {
          skillData:this.skillData
        }

        ///:firebaseId/addSkill
        const url = this.store.baseUrl
        const id = this.store.firebaseData.uid
        axios.put(`${url}/app/${id}/addSkill`, allBody)
          .then(res=> {
            console.log(res)

            Object.assign(this.store.myData,res.data.findme )


            this.skillData = {}

            const result = this.mySkills.some(
              object => object._id === res.data.getSkill._id
            )
            if(!result){
              this.mySkills.push(res.data.getSkill)
            }


          })
          .catch(err => {
            console.log(err)
          })
      }

    },
    getFirebaseData(){
      const check = this.store.firebaseData.hasOwnProperty('uid')
      if(check){
        const firebaseId = this.store.firebaseData.uid
        this.getMySkills(firebaseId)
      }
    },
    getMySkills(firebaseId){
      axios.get(`${this.store.baseUrl}/app/${firebaseId}/getUserSkills`)
        .then(res => {
          console.log(res)
          this.mySkills = res.data.skills
          console.log('myskills',this.mySkills)
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created(){
    //this.getFirebaseData()
    this.$watch('store.firebaseData',(newVal) => {
      if(newVal){
        const check = newVal.hasOwnProperty('uid')
          if(check){
            const firebaseId = newVal.uid
            this.getMySkills(firebaseId)
            ///:firebaseId/getUserSkills
          }
      }
    },{
      immediate:true, deep:true
    })
  },
  watch:{
    'store.firebaseData':{
      handler(newVal){
        if(newVal){
          //
        }
      }
    }
  }
}
</script>

<style>

</style>
