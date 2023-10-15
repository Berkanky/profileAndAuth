<template>
  <q-card
    :style="{
      'width':this.store.mobileActive ? '100%' : '600px',
      'margin':this.store.mobileActive ? '0 auto' : '0% auto',
      'height':this.$q.screen.height + 'px'
    }"
  >
    <q-card-section class="row">
      <q-btn icon="keyboard_backspace" flat color="grey-8" v-on:click="goBack"></q-btn>
      <q-space></q-space>
      <q-btn
        v-if="this.checkcheckStatusResult()"
        icon="restart_alt"
        color="red-4"
        glossy
        class=""
        round
        v-on:click="removePublish"
      >
        <q-tooltip>Remove</q-tooltip>
      </q-btn>
      <q-btn
        v-if="!this.checkcheckStatusResult()"
        v-on:click="publishAdvertise"
        icon="share"
        color="blue-4"
        glossy round
      >
        <q-tooltip>Publish</q-tooltip>
      </q-btn>
    </q-card-section>
    <q-separator size="1.5px"></q-separator>
    <q-input
        label="Describe Your Mention"
        type="textarea" filled color="grey-8"
        v-model="this.userData.mentionAboutMe"
      >
        <template v-slot:prepend>
          <q-icon name="info"></q-icon>
        </template>
      </q-input>
      <q-card-section class="q-mt-md q-pa-md">
        <q-list class="">
          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label>
                <q-icon name="info" color="grey-8"></q-icon>
                {{
                  this.userData.hideLocationDetails === true ? 'Location Details are Avaliable' : 'Location Details are Not Available'
                }}
              </q-item-label>
            </q-item-section>
            <q-item-section avatar class="text-overline">
              <q-toggle
                :disable="this.store.checkStatusResult === true ? false : true"
                @update:model-value="updateHideLocationDetails"
                :color="this.userData.hideLocationDetails === true ? 'green-6' : 'red-4'"
                v-model="this.userData.hideLocationDetails" />
            </q-item-section>
          </q-item>
          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label>
                <q-icon name="info" color="grey-8"></q-icon>
                {{
                  this.checklookingForJob() === true  ? 'Looking For Job' : 'Looking For Personel'
                }}
              </q-item-label>
            </q-item-section>
            <q-item-section avatar class="text-overline">
              <q-toggle
                :disable="this.store.checkStatusResult === true ? false : true"
                @update:model-value="updateLookingForJobStatus"
                :color="this.userData.lookingForJob === true ? 'green-6' : 'red-4'"
                v-model="this.userData.lookingForJob" />
            </q-item-section>
          </q-item>
          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label>
                <q-icon name="info" color="grey-8"></q-icon>
                {{
                  this.checkgalleryactive() === true  ? 'Gallery Details are Available' : 'Gallery Details are Not Available'
                }}
              </q-item-label>
            </q-item-section>
            <q-item-section avatar class="text-overline">
              <q-toggle
                :disable="this.store.checkStatusResult === true ? false : true"
                @update:model-value="updategallerystatus"
                :color="this.userData.hideGalleryActive === true ? 'green-6' : 'red-4'"
                v-model="this.userData.hideGalleryActive" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-separator size="1.5px"></q-separator>
      <q-card-section v-if="this.checkcheckStatusResult()">
        <myAdvertise/>
      </q-card-section>
    <q-card-section horizontal class="q-pa-md absolute-bottom">
        <q-btn
          v-on:click="this.store.currentStep = this.store.currentStep - 1"
          class="col" flat color="grey-8" label="Back" no-caps
          icon="arrow_left"></q-btn>
      </q-card-section>
  </q-card>
</template>

<script>
import myAdvertise from './myAdvertise.vue';
import axios from 'axios';
import { useCounterStore } from 'src/stores/store';
export default {
  components:{
    myAdvertise
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      userData:{},
    }
  },
  methods:{
    updategallerystatus(val){
      console.log(val)
      ///:firebaseId/updategalleryactive
      const allBody = {
        hideGalleryActive:val
      }
      const url = this.store.baseUrl
      const fid = this.store.firebaseData.uid
      axios.put(`${url}/app/${fid}/updategalleryactive`, allBody)
        .then( res => {
          console.log(res)
          this.store.getMyAdvertise()
        })
        .catch(err => {
          console.log(err)
        })
    },
    updateLookingForJobStatus(val){
      ///:firebaseId/updatelookingForJob
      const allBody = {
        lookingForJob:val
      }
      console.log(allBody)
      const url = this.store.baseUrl
      const fid = this.store.firebaseData.uid
      axios.put(`${url}/app/${fid}/updatelookingForJob`, allBody)
        .then(res => {
          console.log(res)
          this.store.getMyAdvertise()
        })
        .catch(err => {
          console.log(err)
        })

      console.log(val)
    },
    checkgalleryactive(){
      const check = this.store.advertiseDetail.hasOwnProperty('hideGalleryActive')
      if(check){
        const val = this.store.advertiseDetail.hideGalleryActive === true ? true : false
        return val
      }else{
        return false
      }
    },
    checklookingForJob(){
      const check = this.store.advertiseDetail.hasOwnProperty('lookingForJob')
      if(check === true){
        const val = this.store.advertiseDetail.lookingForJob === true ? true : false
        return val
      }else{
        return false
      }
    },
    updateHideLocationDetails(val){
      const check = this.store.checkStatusResult === true ? true : false
      if(check){
        console.log(val)

        const allBody = {
          hideLocationDetailsUpdated:val
        }
        ///:firebaseId/updateMyHideLocationDetails
        const url = this.store.baseUrl
        const fid = this.store.firebaseData.uid
        axios.put(`${url}/app/${fid}/updateMyHideLocationDetails`, allBody)
          .then (res => {
            console.log(res)
          })
          .catch( err => {
            console.log(err)
          })
      }
    },
    getAdvertiseDetail(){
      const check = this.store.firebaseData.hasOwnProperty('uid')
      if(check === true){
        this.store.getMyAdvertise()
      }else{
        return
      }
    },
    removePublish(){
      console.log('')
      ///:firebaseId/removeMyAdvertise
      const url = this.store.baseUrl
      const fid = this.store.firebaseData.uid
      axios.put(`${url}/app/${fid}/removeMyAdvertise`)
        .then(res =>{
          console.log(res)
          Object.assign(this.store.myData,res.data.getmeagain)
          this.getStatusAdvertise()
        })
        .catch(err => {
          console.log(err)
        })
    },
    checkcheckStatusResult(){
      const check = this.store.checkStatusResult
      console.log('check',check)
      return check
    },
    getStatusAdvertise(){
      const id = this.store.firebaseData.uid
      this.store.checkMyAdvertiseStatus(id)
    },
    publishAdvertise(){
      ///:firebaseId/postAdveritse
      const allBody = {
        userData:this.userData
      }
      console.log(this.store.myData)
      axios.put(`${this.store.baseUrl}/app/${this.store.firebaseData.uid}/postAdveritse`, allBody)
        .then( res => {
          console.log(res)
          this.getStatusAdvertise()
        })
        .catch(err => {
          console.log(err)
        })
    },
    goBack(){
      this.store.currentStep = this.store.currentStep - 1
    }
  },
  created(){
    this.getAdvertiseDetail()
    this.getStatusAdvertise()
  },
  watch:{
    'store.advertiseDetail':{
      handler(newVal){
        const check = newVal.hasOwnProperty('_id')
        if(check){
          Object.assign(this.userData,{
            mentionAboutMe:newVal.mentionAboutMe,
            hideLocationDetails:newVal.hideLocationDetails ?? false,
            lookingForJob:newVal.lookingForJob ?? true,
            hideGalleryActive:newVal.hideGalleryActive ?? true
          })
          console.log('store.advertiseDetail',this.userData)
        }
      },
      immediate:true,deep:true
    }
  }
}
</script>

<style>

</style>
