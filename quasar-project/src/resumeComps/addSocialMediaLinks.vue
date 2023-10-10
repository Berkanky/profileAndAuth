<template>
  <q-dialog
    v-model="this.store.addSocialMediaLinksDialogActive"
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
    persistent
  >
    <q-card
      class="bg-dark text-white"
      :style="{
        'width':this.store.mobileActive ? '100%' : '500px'
      }"
    >
      <q-card-section>
        <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
      </q-card-section>
      <q-select
          v-if="this.currentStep === 0"
          class="q-mt-sm q-mb-sm"
          :options="this.options"
          dark
          label="Select Platform"
          filled
          color="white"
          v-model="this.selectedOption"
        >
        <template v-slot:prepend>
          <q-icon name="filter_list"></q-icon>
        </template>
        </q-select>
      <q-input
        v-if="this.currentStep === 1"
        label="Link Name" filled dark clear-icon="q-mt-sm q-mb-sm"
        v-model="this.linkData.linkName"
        color="white"
      >
        <template v-slot:prepend>
          <q-icon name="info"></q-icon>
        </template>
      </q-input>
      <q-input
        v-if="this.currentStep === 2"
        label="Link URL" filled dark clear-icon="q-mt-sm q-mb-sm"
        v-model="this.linkData.linkUrl"
        color="white"
      >
        <template v-slot:prepend>
          <q-icon name="link"></q-icon>
        </template>
      </q-input>
      <q-card-section
        class="q-mt-sm q-pa-sm"
        horizontal
      >
        <q-btn
          class="col"
          icon="arrow_left" no-caps label="Back" flat color="red-4" v-if="this.currentStep > 0" v-on:click="this.currentStep = this.currentStep - 1"></q-btn>
        <q-btn
          class="col"
          v-if="this.currentStep < 2"
          icon-right="arrow_right" flat color="green-7" no-caps label="Skip" v-on:click="this.currentStep = this.currentStep + 1"></q-btn>
          <q-btn
          class="col"
          :disable="this.checkForLinkData() ? false : true"
          v-if="this.currentStep === 2 && !this.store.editSocialMediaLinkActive"
          icon-right="add" flat color="green-7" no-caps label="Add" v-on:click="addToSocialMediaLinks"></q-btn>
          <q-btn
            class="col"
            :disable="this.checkForLinkData() ? false : true"
            v-if="this.currentStep === 2 && this.store.editSocialMediaLinkActive"
            icon="edit" flat color="green-7" no   label="Edit" v-on:Click="editLink"
          ></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
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
      options:[
        {id:1,label:'LinkedIn',icon:'fa-brands fa-linkedin'},
        {id:2,label:'GitHub',icon:'fa-brands fa-github'},
        {id:3,label:'Instagram',icon:'fa-brands fa-instagram'},
        {id:4,label:'Kaggle',icon:'fa-brands fa-kaggle'},
        {id:5,label:'Personal Web Site',icon:'person'},
        {id:6,label:'Other',icon:'info'}
      ],
      linkData:{},
      selectedOption:{},
      currentStep:0
    }
  },
  methods:{
    checkForLinkData(){
      const check = ['linkUrl','linkName','linkPlatformType'].every(
        (key) => key in this.linkData
      )
      if(check){
        return true
      }else{
        return false
      }
    },
    editLink(){
      const allBody = {
        newLinkData:this.store.selectedSocialMediaLink
      }

      const url = this.store.baseUrl
      const firebaseId = this.store.firebaseData.uid
      const selectedLinkId = this.store.selectedSocialMediaLink._id

      axios.put(`${url}/app/${firebaseId}/${selectedLinkId}/updateLink`, allBody)
        .then(res => {
          console.log(res)
          Object.assign(this.store.myData, res.data.findme)
          this.goBack()
        })
        .catch(err => {
          console.log(err)
        })
      console.log(this.store.selectedSocialMediaLink)
    },
    addToSocialMediaLinks(){
      console.log(this.linkData)

      const allBody = {
        linkData:this.linkData
      }
      ///:firebaseId/addSocialMediaLink

      axios.put(`${this.store.baseUrl}/app/${this.store.firebaseData.uid}/addSocialMediaLink`, allBody)
        .then(res => {
          console.log(res)
          Object.assign(this.store.myData,res.data.findme)
          this.currentStep = 0
          this.selectedOption = {}
          this.linkData = {}
          this.store.addSocialMediaLinksDialogActive = false
        })
        .catch(err => {
          console.log(err)
        })

    },
    goBack(){
      this.store.selectedSocialMediaLink = {}
      this.store.addSocialMediaLinksDialogActive = false
      this.store.editSocialMediaLinkActive = false
    }
  },
  created(){

  },
  watch:{
    selectedOption:{
      handler(newVal){
        if(newVal){
          console.log(newVal)
          const check = 'id' in newVal
          if(check){
            Object.assign(this.linkData,{
              linkIcon:newVal.icon,
              linkPlatformType:newVal.label
            })
          }
        }
      },
      immediate:true, deep:true
    },
    linkData:{
      handler(newVal){
        if(newVal){
          console.log(newVal)

          for(const key in newVal){
            const checkEachKey = newVal[key] === '' || newVal[key] === null ? true : false
            if(checkEachKey){
              delete newVal[key]
            }
          }
          console.log(newVal)
          const check = this.store.editSocialMediaLinkActive === true ? true : false
          if(check === true){
            Object.assign(this.store.selectedSocialMediaLink,newVal)
          }
        }
      },
      immediate:true,deep:true
    },
    'store.selectedSocialMediaLink':{
      handler(newVal){
        if(newVal){
          const check = this.store.editSocialMediaLinkActive === true ? true : false
          if(check === true){
            Object.assign(this.linkData,this.store.selectedSocialMediaLink)
          }
        }
      },
      immediate:true, deep:true
    }
  }
}
</script>

<style>

</style>
