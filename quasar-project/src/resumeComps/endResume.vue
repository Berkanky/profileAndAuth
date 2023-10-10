<template>
  <q-card
    :style="{
      'width':this.store.mobileActive ? '100%' : '600px',
      'margin':this.store.mobileActive ? '0 auto' : '0% auto'
    }"
  >
    <q-card-section>
      <q-btn icon="keyboard_backspace" flat color="grey-8" v-on:click="goBack"></q-btn>
    </q-card-section>
    <q-separator size="1.5px"></q-separator>
    <q-card-section>
      <q-input
        label="Describe Your Mention"
        type="textarea" filled color="grey-8"
        v-model="this.userData.mentionAboutMe"
      >
        <template v-slot:prepend>
          <q-icon name="info"></q-icon>
        </template>
      </q-input>
    </q-card-section>
    <q-card-section>
      <div class="text-subtitle2 text-grey-8 q-pa-sm">
        <q-icon name="info"></q-icon>
        Give Advertise
      </div>
    </q-card-section>
    <q-card-section class="">
      <q-btn
        v-if="this.checkcheckStatusResult()"
        no-caps label="Remove Publish"
        icon="remove"
        color="red-4"
        push class="q-pa-sm full-width"
        v-on:click="removePublish"
      ></q-btn>
      <q-btn
        v-if="!this.checkcheckStatusResult()"
        v-on:click="publishAdvertise"
        no-caps label="Publish"
        icon="fa-solid fa-light fa-upload fa-beat-fade"
        color="green-4"
        push class="full-width q-pa-sm"
      ></q-btn>
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
      userData:{},
    }
  },
  methods:{
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
            mentionAboutMe:newVal.mentionAboutMe
          })
        }
      },
      immediate:true,deep:true
    }
  }
}
</script>

<style>

</style>
