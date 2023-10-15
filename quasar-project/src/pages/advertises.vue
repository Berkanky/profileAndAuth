<template>
  <q-page class="">
    <q-card style="width:50%;margin:0 auto;">
      <q-card-section class="text-subtitle2">
        yo
      </q-card-section>
    </q-card>
  </q-page>
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

    }
  },
  methods:{

  },
  created(){

  },
  watch:{

  }
}
</script>

<style>

</style>
