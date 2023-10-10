<template>
  <q-page>

  </q-page>
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
      myData:{}
    }
  },
  methods:{

  },
  created(){

  },
  watch:{
    'store.myData':{
      handler(newVal){
        if(newVal){
          const check = newVal.hasOwnProperty('_id')
          if(check){
            this.myData = newVal
            console.log('me',this.myData)
          }
        }
      },
      immediate:true, deep:true
    },
    'store.firebaseData':{
      handler(newVal){
        if(newVal){

        }
      },
      immediate:true, deep:true
    }
  }
}
</script>

<style>

</style>
