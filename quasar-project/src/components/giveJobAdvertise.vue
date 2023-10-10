<template>
  <q-card>
    <q-card-section>
      <q-input
        color="grey-8"
        filled
        label="Enter "
      ></q-input>
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

  },
  created(){

  },
  watch:{

  }
}
</script>

<style>

</style>
