<template>
    <div
      class="col-2"
      v-if="!this.store.mobileActive"
    >
    <q-stepper
      v-model="this.store.currentStep"
      ref="stepper"
      color="green-4"
      animated
      vertical
      flat
      header-nav
      style="width:100%;"
    >
      <q-step
        :color="data.stepVal === this.store.currentStep ? 'teal-5' : 'grey-5'"
        v-for="(data,key) in this.options" :key="key"
        :name="data.id"
        :title="data.label"
        :icon="data.icon"
        :done="data.stepVal < this.store.currentStep"
      >
      </q-step>
    </q-stepper>
    </div>
</template>

<script>
import {useCounterStore} from '../stores/store'
export default {
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      options:[
        {id:1,label:'Upload Resume',icon:'info',stepVal:1},
        {id:2,label:'Personal Informations',icon:'person',stepVal:2},
        {id:3,label:'Education Informations', icon:'school',stepVal:3},
        {id:4,label:'Work Experience',icon:'work',stepVal:4},
        {id:5,label:'Social Media',icon:'info',stepVal:5},
        {id:6,label:'Skills',icon:'person',stepVal:6},
        {id:7,label:'Location',icon:'location_on',stepVal:7},
        {id:8,label:'Searching Positions',icon:'info',stepVal:8},
        {id:9,label:'Account Images',icon:'collections_bookmark',stepVal:9},
        {id:10,label:'Give Advertise',icon:'filter_list',stepVal:10}
      ],
    }
  },
  methods:{
    goSelectedStep(data){
      console.log(data)
    }
  },
  created(){

  },
  watch:{

  }
}
</script>

<style>

</style>
