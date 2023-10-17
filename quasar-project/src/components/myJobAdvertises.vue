<template>
  <q-card
    :style="{
      'height':this.store.mobileActive ? '100%' : this.$q.screen.height + 'px'
    }"
  >
    <q-card-section>
      <q-btn
        v-on:click="goBack"
        icon="keyboard_backspace" flat color="grey-8"></q-btn>
    </q-card-section>
    <q-separator size="1.5px"></q-separator>
    <q-card-section>
      <q-scroll-area
        style="width:100%;height:450px;"
      >
      <q-card
        flat bordered
        v-for="(data,key) in this.store.myJobAdvertises" :key="key"
        class="my-card q-mt-xs">
        <q-item

        >
          <q-item-section avatar>
            <q-avatar size="xl">
<!--               <img
                style="object-fit:cover;"
                v-if="this.myData.userImage || this.myData.googleImage"
                :src="this.myData.userImage ?? this.myData.googleImage" alt=""/> -->
                <q-btn icon="info" flat color="grey-8" round></q-btn>
            </q-avatar>
          </q-item-section>
          <q-item-section class="text-center">
             {{ data._id }}
          </q-item-section>
          <q-item-section vertical class="">
            <q-btn
              v-on:click="rePostOldAdvertise(data)"
              icon="upload" flat color="grey-8"></q-btn>
            <q-btn
              v-on:click="removeOldAdvertise(data)"
              icon="remove" flat color="red-4"></q-btn>
          </q-item-section>
        </q-item>
      </q-card>
    </q-scroll-area>
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
      newData:{},
      myData:{}
    }
  },
  methods:{
    rePostOldAdvertise(data){
      ///:currentUserId/uploadOldAdvertise
      console.log(data)
      const allBody = {
        newData:data
      }
      /* console.log(allBody,this.store.myData._id,this.store.baseUrl) */
      console.log(this.store.myData._id)
      axios.put(`${this.store.baseUrl}/app/${this.store.myData._id}/uploadOldAdvertise`, allBody)
        .then(res => {
          console.log(res)
          this.store.myJobAdvertises = this.store.myJobAdvertises.filter(
            object => object._id !== data._id
          )
        })
        .catch(err => {
          console.log(err)
        })
    },
    removeOldAdvertise(data){
      console.log(data,this.store.getGlobalInfos().url)
      ///:currentUserId/:advertiseId/removeSelectedOldAdvertise
      axios.put(`${this.store.getGlobalInfos().url}/app/${this.store.getGlobalInfos().uid}/${data._id}/removeSelectedOldAdvertise`)
        .then(res => {
          console.log(res)
          this.store.myJobAdvertises = this.store.myJobAdvertises.filter(
            object => object._id !== data._id
          )
        })
        .catch(err => {
          console.log(err)
        })
    },
    getMyDetails(newVal){
      const check = newVal.hasOwnProperty('_id')
      if(check === true){
        this.myData = newVal
        console.log('myData',this.myData)
      }
    },
    goBack(){
      const backActive = true
      this.$emit('goBackSelectedOption',backActive)
    },
    getMyAllOldAdvertises(){
      const check = this.store.firebaseData.hasOwnProperty('uid')
      if(check){
        this.store.getAllOldAdvertises()
      }
    }
  },
  created(){
    this.getMyAllOldAdvertises()
  },
  watch:{
    'store.myData':{
      handler(newVal){
        if(newVal){
          this.getMyDetails(newVal)
        }
      },
      immediate:true, deep:true
    }
  }
}
</script>

<style>

</style>
