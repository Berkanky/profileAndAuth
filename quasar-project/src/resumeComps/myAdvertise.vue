<template>
   <q-card class="my-card" flat bordered>
      <q-card-section horizontal>
        <q-card-section class="q-pt-xs col" >
          <div class="text-caption text-grey-5 text-weight-bold">
            <q-icon name="info"></q-icon>
            {{ this.checkadvertiseDetail() === true ? 'Advertise NoneActive' : 'Advertise Active' }}
            <q-btn icon="fiber_manual_record" flat :color="this.checkadvertiseDetail() === true ? 'red-4' : 'green-4'" size="sm"></q-btn>
          </div>
          <div class="text-subtitle2 text-grey-8 text-weight-bold q-mt-sm q-mb-xs">
            {{ this.checklookingForJob() === true ? 'Looking For Job' : 'Looking For Personel' }}
          </div>
          <div class="text-caption text-grey">

          </div>
        </q-card-section>

        <q-card-section class="col-5 flex flex-center" style="height:200px;">
          <q-img
            v-if="this.checkgalleryactive()"
            loading="lazy"
            spinner-color="white"
            :src="this.checkAdvertiserImage()"
            style="object-fit:cover;height:100%;"
            class="rounded-borders"
          />
          <q-btn
            v-else
            icon="collections_bookmark" flat color="grey-8" class="full-width full-height" size="xl"></q-btn>
        </q-card-section>
      </q-card-section>

      <q-separator />

      <q-card-section class="row">
        <q-btn
          class="col"
          v-on:click="selectOption(data)"
          v-for="(data,key) in this.options" :key="key"
          :icon="data.icon"
          :color="data.color"
          :label="data.label" no-caps flat
        ></q-btn>
      </q-card-section>
    </q-card>
</template>

<script>
import axios, { all } from 'axios'
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
        {id:2,label:'Disable',icon:'update',color:'grey-8'},
        {id:3,label:'Detail',icon:'login',color:'grey-8'}
      ],
      advertiseDetail:{}
    }
  },
  methods:{
    checkgalleryactive(){
      const check = this.advertiseDetail.hasOwnProperty('hideGalleryActive')
      if(check){
        const val = this.advertiseDetail.hideGalleryActive === true ? true : false
        return val
      }else{
        return false
      }
    },
    checklookingForJob(){
      const check = this.advertiseDetail.hasOwnProperty('lookingForJob')
      if(check){
        const val = this.advertiseDetail.lookingForJob === true ? true : false
        return val
      }else{
        return false
      }
    },
    checkadvertiseDetail(){
      const check = this.advertiseDetail.hasOwnProperty('hideAdvertiseStatus')
      if(check){
        const val = this.advertiseDetail.hideAdvertiseStatus === true ? true : false
        return val
      }else{
        return false
      }
    },
    checkAdvertiserImage(){
      const check = this.advertiseDetail.hasOwnProperty('jobAdvertiserDetails')
      if(check === true){
        const image = this.advertiseDetail.jobAdvertiserDetails.userImage ?? this.advertiseDetail.jobAdvertiserDetails.googleImage
        return image
      }
    },
    updateDisableAdvertise(){
      const allBody = {}
      const check = this.advertiseDetail.hasOwnProperty('hideAdvertiseStatus')
      if(check === true){
        const hideAdvertiseStatus = this.advertiseDetail.hideAdvertiseStatus =! this.advertiseDetail.hideAdvertiseStatus
        Object.assign(allBody,{
          hideAdvertiseStatus:hideAdvertiseStatus
        })
      }else{
        Object.assign(allBody,{
          hideAdvertiseStatus:false
        })
      }
      console.log(allBody)
      ///:firebaseId/updateHideAdvertiseStatus
      const url = this.store.baseUrl
      const fid = this.store.firebaseData.uid
      axios.put(`${url}/app/${fid}/updateHideAdvertiseStatus`, allBody)
        .then(res => {
          console.log(res)

          this.store.getMyAdvertise()
        })
        .catch(err =>{
          console.log(err)
        })

    },
    getDetailSelectedAdvertise(){
      ///:selectedAdvertiseId/getDetailAdvertise
      const url = this.store.baseUrl
      const id = this.store.advertiseDetail._id
      axios.get(`${url}/app/${id}/getDetailAdvertise`)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    selectOption(data){
      if(data.id === 1){

      }else if(data.id === 2){
        //hideAdvertiseStatus
        this.updateDisableAdvertise()
      }else if(data.id === 3){
        this.getDetailSelectedAdvertise()
      }
    },
    checkWatch(){
      const check = this.checkadvertiseDetail() === true ? true : false
      if(check === true){
        const result = this.options.find(
          object => object.id === 2
        )
        if(result){
          Object.assign(result,{
            label:'Disable',
            icon:'update',
            color:'red-8'
          })
        }
      }else{
        const defaultVal = {
            id:2,
            label:'Active',
            icon:'update',
            color:'green-4'
          }

        const result = this.options.find(
          object => object.id === defaultVal.id
        )
        if(result){
          Object.assign(result,defaultVal)
        }
      }
    }
  },
  created(){
    this.$watch('store.firebaseData',(newVal) => {
      const check = newVal.hasOwnProperty('uid')
      if(check){
        this.store.getMyAdvertise()
        this.store.getAllActiveAdvertises() 
      }
    },{
      immediate:true, deep:true
    })


  },
  watch:{
    'store.advertiseDetail':{
      handler(newVal){
        if(newVal){
          const check = newVal.hasOwnProperty('_id')
          if(check === true){
            this.advertiseDetail = newVal
            console.log('advertiseDetail',this.advertiseDetail)
            this.checkWatch()
          }
        }
      },
      immediate:true,deep:true
    }
  }
}
</script>

<style>

</style>
