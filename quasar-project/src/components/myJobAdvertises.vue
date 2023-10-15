<template>
  <q-card>
    <q-card-section>

    </q-card-section>
  </q-card>
</template>

<script>
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
      newData:{}
    }
  },
  methods:{
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

  }
}
</script>

<style>

</style>
