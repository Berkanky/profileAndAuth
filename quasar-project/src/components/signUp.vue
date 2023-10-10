<template>
  <q-card
    class=""
    style="margin:0 auto;"
    :style="{
      'margin-top':this.store.mobileActive ? '0%' : '20%',
      'width':this.store.mobileActive ? '100%' : '600px'
    }"
    flat
  >

  <q-card-section class="text-center text-weight-bold text-grey-7">
      <q-icon name="person_add" size="md" color="grey-7"></q-icon>
      SignUp
    </q-card-section>
  <q-card-section>
      <q-input
        color="blue-3"
        type="email"
        label="E-Mail"
        outlined
        v-model="this.userData.email"
      >
        <template v-slot:prepend>
          <q-icon name="mail"></q-icon>
        </template>
        <template v-slot:append>
          <q-btn icon="remove" color="red-4" flat v-if="this.userData.email" v-on:click="delete this.userData.email"></q-btn>
        </template>
      </q-input>
      <q-input
        label="Password"
        color="blue-3"
        class="q-mt-sm"
        v-model="this.userData.password" outlined
        :type="isPwd ? 'password' : 'text'">
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
          <q-btn icon="remove" flat color="red-4" v-if="this.userData.password" v-on:click="delete this.userData.password"></q-btn>
        </template>
        <template v-slot:prepend>
          <q-icon name="lock"></q-icon>
        </template>
      </q-input>
      <q-input
        :disable="this.checkvertificationResData() ? false : true"
        v-model="this.vertificationCode"
        outlined
        color="blue-3"
        label="Enter Vertification Code"
        class="q-mt-sm"
      >
        <template v-slot:prepend>
          <q-icon name="lock"></q-icon>
        </template>
        <template v-slot:append>
          <q-btn
            v-if="this.vertificationCode"
            icon="remove" flat color="red-4" v-on:click="this.vertificationCode = ''"></q-btn>
        </template>
      </q-input>
    </q-card-section>
    <q-card-section class="text-grey-7">
      <q-radio
        v-model="this.signUpData.customerPolicyActive"
        :label="this.signUpData.customerPolicy" color="grey-8" />
      <q-radio
        v-model="this.signUpData.dataPolicyActive"
        :label="this.signUpData.dataPolicy" color="grey-8" />
    </q-card-section>
    <q-card-section>
      <q-btn
        v-if="this.checkvertificationResData() && this.vertificationCode && this.checksignUpData()"
        v-on:click="signUpButton"
        icon="person_add" color="green-4" no-caps label="SignUp" class="full-width"></q-btn>
        <q-btn
          push
          icon="key"
          class="full-width"
          color="blue-4"
          no-caps
          label="Send Vertification Code"
          v-else
          v-on:click="sendVertificationCodeToEmail"
        ></q-btn>
    </q-card-section>
    <q-card-section>
    <q-btn
      v-on:click="
        this.store.loginPageCurrentOption.signActive =! this.store.loginPageCurrentOption.signActive
      "
      no-caps label="SignIn"
      icon="keyboard_backspace" flat color="grey-8"></q-btn>
  </q-card-section>

<!--     <q-card-section class="text-center">
      <q-btn icon="login" flat color="grey-7" no-caps label="Login" v-on:click="this.store.loginPageCurrentOption.signActive =! this.store.loginPageCurrentOption.signActive"></q-btn>
    </q-card-section> -->
  </q-card>
</template>

<script>
import axios from 'axios'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
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
      vertificationCode:'',
      userData:{},
      isPwd:false,
      signUpData:{
        customerPolicyActive:false,
        customerPolicy:'I accept the Service Agreement.',
        dataPolicyActive:false,
        dataPolicy:'I consent to my data being processed and kept abroad as specified in the Information Text.',

      },
      vertificationResData:{}
    }
  },
  methods:{
    checksignUpData(){
      const check = this.signUpData.customerPolicyActive === true  && this.signUpData.dataPolicyActive === true ? true : false
      return check
    },
    sendVertificationCodeToEmail(){
      const check = ['email','password'].every(key => key in this.userData)
      if(check){
        this.vertificationFunction()
      }else{
        this.negativenotifymessage()
      }
    },
    checkvertificationResData(){
      const check = Object.keys(this.vertificationResData).length
      if(check > 0){
        return true
      }else{
        return false
      }
    },
    firebaseSignUpButton(){
      const auth = getAuth();
        const email = this.userData.email
        const password = this.userData.password
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            // ...
            this.store.firebaseData = user
            this.$router.push(
              {
                path:'/home'
              }
            )
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
          });
    },
    vertificationFunction(){
      const allBody = {
        userData:this.userData
      }
      axios.put(`${this.store.baseUrl}/app/vertificationCrud`, allBody)
        .then(res => {
          console.log(res)
          this.vertificationResData = res.data.sendEmailVertification
        })
        .catch(err => {
          console.log(err)
        })

    },
    negativenotifymessage(){
      this.$q.notify({
          type:'negative',
          icon:'info',
          message:'Please Fill Out the Required Information.',
          position:'right'
        })
    },
    signUpButton(){
      const check = ['email','password'].every((key) => key in this.userData)
      if(check){
        const secCheck = 'vertificationId' in this.vertificationResData
        if(secCheck){
          const thirdCheck = this.vertificationResData.vertificationId === this.vertificationCode ? true : false
          if(thirdCheck){
            this.firebaseSignUpButton()
          }else{
            this.$q.notify({
              type:'negative',
              message:'Wrong Vertification Code !',
              position:'right',
              icon:'info'
            })
            this.vertificationCode = ''
            this.vertificationResData = {}
          }
        }
      }else{
        this.negativenotifymessage()
      }
    }
  },
  created(){

  },
  watch:{

  }
}
</script>

<style>

</style>
