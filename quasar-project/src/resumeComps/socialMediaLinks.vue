<template>
  <q-card
  class="q-pa-sm"
      :style="{
        'width':this.store.mobileActive ? '100%' : '600px',
        'margin':this.store.mobileActive ? '0 auto' : '0% auto'
      }"
  >
      <q-card-section class="">
        <div class="text-subtitle2 text-weight-bold text-grey-8 text-center">
          Social Media Links
        </div>
        <div class="text-caption text-red-4 text-weight-bold">
          <q-icon name="info"></q-icon>
          Not Required*
        </div>
      </q-card-section>
      <q-separator size="1.5px"></q-separator>
      <q-card-section>
        <q-scroll-area
          :style="{
              'height':this.store.mobileActive ? ''  : (this.$q.screen.height)/1.64 + 'px',
              'width':this.store.mobileActive ? '100%' : '100%'
            }"
        >
        <q-card
          bordered
          style="border-radius:4px;"
          class="q-mt-xs text-grey-8"
          v-for="(data,key) in this.mySocialMediaLinks" :key="key"
        >
          <q-item>
            <q-item-section avatar class="">
              <q-avatar :icon="data.linkIcon" size="xl"></q-avatar>
            </q-item-section>
            <q-item-section class="text-left text-capitalize">
              <q-btn
                icon-right="open_in_new"
                :label="data.linkName ?? ''" flat v-on:click="openLink(data)" no-caps></q-btn>
            </q-item-section>
            <q-item-section class="" vertical>
              <q-btn
                v-on:Click="editLink(data)"
                class="q-pa-xs"
                icon="update" flat color="grey-8"
              ></q-btn>
              <q-btn
                class="q-pa-xs"
                v-on:click="deleteLink(data)"
                icon="remove" flat color="red-4"
              ></q-btn>
            </q-item-section>
          </q-item>
        </q-card>
      </q-scroll-area>
      </q-card-section>
      <q-separator size="1.5px"></q-separator>
      <q-card-section>
        <q-btn icon="add" color="green-4" flat label="Add Link" no-caps class="full-width" icon-right="link" v-on:click="addLinkButton"></q-btn>
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
      <addSocialMediaLinks v-if="this.store.addSocialMediaLinksDialogActive"/>
  </q-card>
</template>

<script>
import addSocialMediaLinks from './addSocialMediaLinks.vue';
import axios from 'axios';
import { useCounterStore } from 'src/stores/store';
export default {
  components:{
    addSocialMediaLinks
  },
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
        {id:5,label:'Personal Web Site',icon:'person'}
      ],
      mySocialMediaLinks:[]
    }
  },
  methods:{
    editLink(data){
      this.store.selectedSocialMediaLink = data
      this.store.addSocialMediaLinksDialogActive = true
      this.store.editSocialMediaLinkActive = true
    },
    deleteLink(data){
      ///:firebaseId/:selectedLinkId/removeSocialMediaLink

      const firebaseId = this.store.firebaseData.uid
      const selectedLinkId = data._id
      const url = this.store.baseUrl
      console.log(data)
      axios.put(`${url}/app/${firebaseId}/${selectedLinkId}/removeSocialMediaLink`)
        .then(res => {
          console.log(res)

          this.mySocialMediaLinks = this.mySocialMediaLinks.filter(
            object => object._id !== data._id
          )
        })
        .catch(err => {
          console.log(err)
        })
    },
    openLink(data){
      console.log(data)
      const check = data.hasOwnProperty('linkUrl')
      if(check){
        window.open(data.linkUrl, "_blank");
      }
    },
    addLinkButton(){
      this.store.addSocialMediaLinksDialogActive =! this.store.addSocialMediaLinksDialogActive
    },
    getMySocialMediaLinks(){
      const check = this.store.firebaseData.hasOwnProperty('uid')
      if(check){
        const id = this.store.firebaseData.uid
        const url = this.store.baseUrl

        ///:firebaseId/getSocialMediaLinks

        axios.get(`${url}/app/${id}/getSocialMediaLinks`)
          .then(res => {
            console.log(res)
            this.mySocialMediaLinks = res.data.socialMediaLinks
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  },
  created(){
    this.getMySocialMediaLinks()
    this.$watch('store.myData',(newVal) => {
      if(newVal){
        this.getMySocialMediaLinks()
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
