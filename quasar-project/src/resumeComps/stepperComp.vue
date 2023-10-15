<template>
  <q-page-sticky position="left" class="col-2">
    <q-list
      :style="{
        'height':this.$q.screen.height + 'px'
      }"
      v-if="!this.store.mobileActive"
      bordered padding class="bg-grey-2 ">
      <q-item
        v-for="(data,key) in this.options" :key="key"
        clickable
        v-ripple
        class=""
        :active="this.store.currentStep === data.stepVal ? true : false"
        @click="this.store.currentStep = data.stepVal"
        active-class="bg-grey-8 text-white"
        style=""
      >
      <q-item-section avatar>
<!--           <q-icon
            :color="this.store.currentStep === data.stepVal ? 'white' : 'grey-8'"
            :name="data.icon" /> -->
            <q-btn flat :label="data.stepVal" :color="this.store.currentStep === data.stepVal ? 'white' : 'grey-8'"></q-btn>
        </q-item-section>

        <q-item-section :class="this.store.currentStep === data.stepVal ? 'text-white' : 'text-grey-8'">

          <div>
            {{ data.label }}
          </div>

        </q-item-section><!--
        <q-item-section class="">
          <q-icon :name="this.checkNeedsForWorkAdvertise(data)" color="red"></q-icon>
        </q-item-section> -->
      </q-item>
    </q-list>
  </q-page-sticky>

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
    checkNeedsForWorkAdvertise(data){
      let requierementsList = [1,2,4,6,7,8]
      const check = requierementsList.some(
        object => object === data.id
      )
      if(check){
        return 'star'
      }else{
        return ''
      }
    },
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
