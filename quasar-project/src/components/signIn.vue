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
      <q-icon name="person" size="md" color="grey-7"></q-icon>
      SignIn
    </q-card-section>
    <q-card-section class="row">
      <q-btn
        v-on:click="anonymousLogin"
        no-caps
        color="grey-2"
        text-color="grey-8"
        icon="fa-regular fa-user fa-spin fa-spin-reverse"
        label="Anonymous" class="col q-pa-md"></q-btn>
        <q-btn
        no-caps
        v-on:Click="loginWithGoogle"
        color="grey-2"
        text-color="red-4"
        icon="fa-brands fa-google fa-spin fa-spin-reverse"
        label="Google" class="col q-ml-xs q-pa-md"></q-btn>
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
    </q-card-section>
    <div class="text-right">
      <q-btn
        :disable="this.userData.email ? false : true"
        icon="info" flat label="Forget Password" no-caps size="sm" color="grey-8" v-on:click="sendPasswordReset"></q-btn>
    </div>
    <q-card-section>
      <q-btn
        push
        icon="login" class="full-width"
        color="green-4" label="Login" no-caps v-on:click="loginTheSystem"></q-btn>
    </q-card-section>
    <q-card-section class="text-right">
      <q-btn
        icon-right="arrow_right"
        icon="person_add" flat
        color="grey-7" no-caps label="SignUp" v-on:click="signUpButton"></q-btn>
    </q-card-section>
  </q-card>
</template>

<script>
import { getAuth, signInWithPopup, GoogleAuthProvider, signInAnonymously, signInWithEmailAndPassword, sendPasswordResetEmail    } from "firebase/auth";
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
      userData:{},
      isPwd:false
    }
  },
  methods:{
    sendPasswordReset(){
      const email = this.userData.email
      const auth = getAuth();
      sendPasswordResetEmail(auth, email)
        .then(() => {
          // Password reset email sent!
          // ..
          this.$q.notify({
            type:'positive',
            message:'Password Reset Mail Sended, Check Your Gmail.',
            position:'right'
          })
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
    },
    anonymousLogin(){
      const auth = getAuth();
      signInAnonymously(auth)
        .then(() => {
          // Signed in..
          this.$router.push(
            {
              path:'/home'
            }
          )
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ...
        });
    },
    signUpButton(){
      this.store.loginPageCurrentOption.signActive =! this.store.loginPageCurrentOption.signActive
    },
    signInFunctionFirebase(){
      const email = this.userData.email
      const password = this.userData.password
      const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
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
          });
    },
    loginTheSystem(){
      const check = ['email','password'].every((key) => key in this.userData)
      if(check){
        this.signInFunctionFirebase()
      }else{
        this.$q.notify({
          type:'negative',position:'right',message:'Try Again !',icon:'info'
        })
      }
    },
    loginWithGoogle(){
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          // IdP data available using getAdditionalUserInfo(result)
          // ...
          this.store.firebaseData = user
          this.$router.push(
            {
              path:`/home`
            }
          )
          console.log('firebaseData',this.store.firebaseData)
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    },
    newStyle(){
      const check = this.store.mobileActive
      if(!check){
        return {
          top: '50%',
          transform:' translate(0%, -200%)',
          width:'600px'
        }
      }else{
        return {
          width:'100%'
        }
      }
    }
  },
  mounted(){
  },
  created(){

  },

  watch:{

  }
}
</script>

<style>
</style>
