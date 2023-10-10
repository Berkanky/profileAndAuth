<template>
  <div class="myapp">
    <router-view />
  </div>
</template>

<script>
import {auth} from './firebase/index.js'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { defineComponent, watch } from 'vue'
import { useCounterStore } from './stores/store'
import axios from 'axios'
export default defineComponent({
  name: 'App',
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
    handleResize() {
      this.store.window.width = window.innerWidth;
      this.store.window.height = window.innerHeight;
      console.log('window',this.store.window)
    },
    checkUserAuth(){
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          const uid = user.uid;
          // ...
          this.store.firebaseData = user
          console.log('user',user)
        } else {
          // User is signed out
          // ...
          this.$router.replace({path:'/login'})
          console.log('please Login')
        }
      });
    },
    sendWelcomeMessage(id){
      const userData = {
        isAnonymous:this.store.firebaseData.isAnonymous,
        email:this.store.firebaseData.email,
        googleImage:this.store.firebaseData.photoURL ?? '',
        displayName:this.store.firebaseData.displayName ?? ''
      }
      const allBody = {
        userData
      }
      if(!this.store.firebaseData.isAnonymous){
        axios.put(`${this.store.baseUrl}/app/${id}/updateCurrentDetail`, allBody)
        .then(res => {
          console.log('sendWelcomeMessage',res)
        })
        .catch(err => {
          console.log(err)
        })
      }
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  created(){
    this.checkUserAuth()
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  watch:{
    'store.mobileActive':{
      handler(newVal){
        if(newVal){
          console.log(newVal)
        }
      },
      immediate:true, deep:true
    },
    'store.window':{
      handler(newVal,oldVal){
        if(newVal){
          const check = ['width','height'].every((key) => key in this.store.window)
          if(check === true){
            const valCheck = Number(this.store.window.width) < Number(768) ? true : false
            if(valCheck === true){
              this.store.mobileActive = true
            }else{
              this.store.mobileActive = false
            }
            console.log(this.store.mobileActive)
          }
        }
      },
      immediate:true, deep:true
    },
    'store.firebaseData':{
      handler(newValue, oldValue){
        if(newValue){
          const check = 'uid' in newValue
          if(!check){

          }else{
            const firebaseId = newValue.uid
            console.log('firebaseId',firebaseId)
            this.store.getUserDetailFromDB(firebaseId)
          }
        }
      },
      immediate:true, deep:true
    },
    $route:{
      handler(to,from){
        console.log('to',to)
        const check = 'uid' in this.store.firebaseData
          if(check){
            const id = this.store.firebaseData.uid
            this.sendWelcomeMessage(id)
          }
      },
      immediate:true,deep:true
    }
  }
})
</script>

<style>
  .myapp{
    font-family: 'Roboto Mono', monospace;
  }
</style>
