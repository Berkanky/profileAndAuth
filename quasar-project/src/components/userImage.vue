<template>
  <img
    style="object-fit:cover;"
    :src="this.store.myData.userImage ?? this.store.firebaseData.photoURL ?? this.store.defaultPhoto"
    alt=""
  >
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
      imageData:{},
      defaultPhoto:'https://img.freepik.com/premium-vector/avatar-profile-icon-vector-illustration_276184-165.jpg',
      currentImage:''
    }
  },
  methods:{
  },
  created(){
  },
  watch:{
    imageData:{
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
