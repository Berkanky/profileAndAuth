<template>
  <q-card
    style="margin:0 auto;"
    :style="{
      'width':this.store.mobileActive ? '100%' : '600px'
    }"

  >
  <q-card-section class="">
    <q-btn
      class="full-width"
      v-touch-hold:1000.mouse="event => removeMyLocation()"
      icon="location_on"
      color="green-4" no-caps label="Get Location"
      v-on:Click="getCurrentLocationLatLng">
    </q-btn>
  </q-card-section>
  <q-card-section>
      <q-input
        v-model="this.newLocationData.country"
        filled
        color="grey-8"
        :label="this.store.myData.locationAdressDetail ?  this.store.myData.locationAdressDetail.country : 'Enter Country'"
      >
        <template v-slot:prepend>
          <q-icon name="location_on"></q-icon>
        </template>
      </q-input>
      <q-input
        class="q-mt-xs"
        v-model="this.newLocationData.city"
        filled
        color="grey-8"
        :label="this.store.myData.locationAdressDetail ?  this.store.myData.locationAdressDetail.city : 'Enter City'"
      >
        <template v-slot:prepend>
          <q-icon name="location_on"></q-icon>
        </template>
      </q-input>
      <q-input
        class="q-mt-xs"
        v-model="this.newLocationData.address"
        type="textarea"
        color="grey-8"
        filled
        :label="this.store.myData.locationAdressDetail ?  this.store.myData.locationAdressDetail.address : 'Enter Address'"
      >
        <template v-slot:prepend>
          <q-icon name="location_on"></q-icon>
        </template>
      </q-input>
    </q-card-section>
    <q-card-section>
      <mapVue
        @newLatLng="getnewLatLng"
        v-if="this.checkLatLng()"/>
    </q-card-section>
    <q-card-section
      class="q-pa-sm row" >
      <q-btn
        :disable="this.checknewLocationData() ? false : true"
        v-on:click="clearAll"
        no-caps label="Clear"
        icon="clear_all" color="red-4" class="col"
      ></q-btn>
      <q-btn
        :disable="this.checknewLocationData() ? false : true"
        v-on:Click="saveCurrentLocation"
        color="green-4" label="Save&Skip" no-caps class="col q-ml-xs"
      ></q-btn>
    </q-card-section>
    <q-card-section horizontal class="q-pa-md">
      <q-btn
        no-caps
        class="col"
        label="Back"
        v-on:click="this.store.currentStep = this.store.currentStep - 1"
        icon="arrow_left" flat color="grey-8"></q-btn>
      <q-btn
        flat color="grey-8" no-caps label="Next" icon-right="arrow_right" class="col q-mt-sm"></q-btn>
    </q-card-section>
  </q-card>
</template>

<script>
import mapVue from 'src/components/map.vue';
import axios from 'axios';
import { useCounterStore } from 'src/stores/store';
export default {
  components:{
    mapVue
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      newLocationData:{}
    }
  },
  methods:{
    locationQuestion(){
      this.$q.dialog({
        title:'Location',
        message:'Do you want to get your current location ?',
        cancel:true,
        fullHeight:this.store.mobileActive ? true : false,
        maximized:this.store.mobileActive ? true : false,
        color:'red-4'
      }).onOk(() => {
        this.getCurrentLocationLatLng()
      })
    },
    getYourLocation(){
      const firstCheck = this.store.myData.hasOwnProperty('locationAdressDetail')
      if(firstCheck){
        const check = ['lat','lng'].every(
          (key) => key in this.store.myData.locationAdressDetail
        )
        if(!check){
          this.locationQuestion()
        }else{
          //
        }
      }else{
        this.locationQuestion()
      }
    },
    getnewLatLng(data){
      if(data){
        console.log(data)
        const allBody = {
          lat:data.lat,
          lng:data.lng
        }

        const check = ['lat','lng'].every(
          (key) => key in allBody
        )
        if(check){
          this.getCurrentLocationDetails(allBody)
        }
      }
    },
    checkLatLng(){
      const locationData = this.store.myData.locationAdressDetail
      const check = ['lat','lng'].every((key) => key in locationData)
      if(check){
        const secCheck = locationData.lat !== '' && locationData.lat !== null && locationData.lng !== '' && locationData.lng !== null ? true : false
        return secCheck
      }else{
        return false
      }
    },
    removeMyLocation(){
      console.log('yo')
      const url = this.store.baseUrl
      const fid = this.store.firebaseData.uid
      axios.put(`${url}/app/${fid}/removeMyLocation`)
        .then(res=>{
          console.log(res)
          Object.assign(this.store.myData,res.data.findme)
          this.newLocationData = {}
        })
        .catch(err => {
          console.log(err)
        })
    },
    getCurrentLocationFromDb(){
      const url = this.store.baseUrl
      const fid = this.store.firebaseData.uid

      axios.get(`${url}/app/${fid}/getCurrentLocation`)
        .then(res => {
          console.log(res)

          Object.assign(this.newLocationData,res.data.locationAdressDetail)

        })
        .catch(err => {
          console.log(err)
        })
    },
    saveCurrentLocation(){
      ///:firebaseId/updateMyLocation
      console.log(this.newLocationData)
      const allBody = {
        newLocationData:this.newLocationData
      }
      const url = this.store.baseUrl
      const fid = this.store.firebaseData.uid
      axios.put(`${url}/app/${fid}/updateMyLocation`, allBody)
        .then(res => {
          console.log(res)
          Object.assign(this.store.myData,res.data.findme)
          this.newLocationData = {}
        })
        .catch(err => {
          console.log(err)
        })
    },
    clearAll(){
      this.newLocationData = {}
    },
    checknewLocationData(){
      const check = ['city','country','address'].every((key) => key in this.newLocationData)
      if(check){
        return true
      }else{
        return false
      }
    },
    async getCurrentLocationDetails(allBody){
      const res = await fetch(`
        https://api.opencagedata.com/geocode/v1/json?q=${allBody.lat}+${allBody.lng}&key=${this.store.openCageApiKey}`
      )
      const resData = await res.json()
      const formData = {}

      const lat = allBody.lat
      const lng = allBody.lng
      const address = resData.results[0].formatted
      const country = resData.results[0].components.country
      const city = resData.results[0].components.province
      Object.assign(formData,{
        address,country,city,lat,lng,locationUpdateDate:new Date().toLocaleString()
      })

      Object.assign(this.newLocationData,formData)

      console.log(formData)
    },
    getCurrentLocationLatLng(){
      const navigator = window.navigator;
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const allBody = {
          lat:latitude,
          lng:longitude
        }
        console.log(allBody)
        this.getCurrentLocationDetails(allBody)
      });
    },
  },
  created(){
    this.getYourLocation()
    this.getCurrentLocationFromDb()

    this.$watch('store.myData',(newVal) => {
      if(newVal){
        this.getCurrentLocationFromDb()
        this.getYourLocation()
      }
    },{
      immediate:true, deep:true
    })

  },
  watch:{

  }
}
</script>

<style>

</style>
