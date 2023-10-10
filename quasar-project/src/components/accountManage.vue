<template>
  <q-card>
    <q-card-section class="text-subtitle2 row">
      <div>
        Email - {{ this.store.myData.email ?? this.store.firebaseData.email ?? 'No Email Info' }}
        <q-btn icon="arrow_right" flat color="dark"></q-btn>
        <q-btn
          v-on:click="deleteAcc"
          icon="mail" color="red-4"  flat round class="q-pa-sm"></q-btn>
      </div>
    </q-card-section>
    <q-card-section>
      <q-input
        color="grey-8"
        v-model="this.checkAuthentication.codeVal"
        filled
        label="Check Your Email"
        :disable="this.checkOnlyEmailSentOrNot() ? false : true"
      >
        <template v-slot:prepend>
          <q-icon name="info"></q-icon>
        </template>
        <template v-slot:append>
          <q-btn icon="restart_alt" flat color="dark" v-on:click="sendCodeDeleteCheck"></q-btn>
          <q-btn icon="remove" flat color="red-4" v-if="this.checkAuthentication.codeVal" v-on:click="removeCodeVal"></q-btn>
        </template>
      </q-input>
      <div
        :class="this.newClass()"
        class="" v-if="this.checkCodeCorrect()">
        {{ this.checkAuthentication.codeVal }}
      </div>
    </q-card-section>
    <q-card-section v-if="this.syncCodeValAndCodeCorrect()">
      <q-btn icon="delete_forever" class="full-width" color="red-3" no-caps label="Delete Account" v-on:click="deleteAccountConfirm"></q-btn>
    </q-card-section>
    <q-dialog
      v-if="this.deleteConfirmDialogActive"
      v-model="this.deleteConfirmDialogActive"
      :full-height="this.store.mobileActive ? true : false"
      :maximized="this.store.mobileActive ? true : false"
      persistent
    >
      <q-card
        :style="{
          'width':this.store.mobileActive ? '100%' : '500px',
          'max-width':this.store.mobileActive ? '100%' : '500px'
        }"
      >
        <q-card-section>
          <q-btn icon="keyboard_backspace" flat color="dark" v-on:click="this.deleteConfirmDialogActive =! this.deleteConfirmDialogActive"></q-btn>
        </q-card-section>
        <q-separator size="1.5px"></q-separator>
        <q-card-section>
          <q-input
            color="grey-8"
            type="email"
            v-model="this.deleteConfirmData.email"
            filled
            label="Enter Email"
          >
            <template v-slot:prepend>
              <q-icon name="email"></q-icon>
            </template>
            <template v-slot:append>
              <q-btn
                v-if="this.deleteConfirmData.email"
                icon="remove" flat color="red-4" v-on:click="delete this.deleteConfirmData.email"></q-btn>
            </template>
          </q-input>
          <q-input
            class="q-mt-sm"
            type="textarea"
            color="grey-8"
            filled
            label="Enter İnfo For Delete Action..."
            v-model="this.deleteConfirmData.deleteDescription"
          >
            <template v-slot:prepend>
              <q-icon name="info"></q-icon>
            </template>
            <template v-slot:append>
              <q-btn
                v-on:click="delete this.deleteConfirmData.deleteDescription"
                icon="remove" flat color="red-4" v-if="this.deleteConfirmData.deleteDescription"></q-btn>
            </template>
          </q-input>
        </q-card-section>
        <q-card-section
          v-if="this.deleteConfirmData.email === this.store.firebaseData.email && this.deleteConfirmData.deleteDescription ? true : false"
        >
          <q-btn
            class="full-width"
            icon="delete_forever" color="red-4" v-on:click="completeDeleteProcess"></q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import { getAuth, deleteUser } from "firebase/auth";
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
      checkAuthentication:{},
      deleteConfirmDialogActive:false,
      deleteConfirmData:{}
    }
  },
  methods:{
    checkOnlyEmailSentOrNot(){
      const check = this.checkAuthentication.hasOwnProperty('codeValCorrect')
      if(check === true){
        return true
      }else{
        return false
      }
    },
    emailSendedNotify(){
      this.$q.notify({
        type:'positive',
        message:'Check Your Email',
        icon:'info'
      })
    },
    deleteAccFirebase(){
      const auth = getAuth();
      const user = auth.currentUser;
      console.log(user)

      this.deleteAccLastly()
      deleteUser(user).then(() => {
        this.$router.replace(
          {
            path:`/login`
          }
        )

        this.store.myData = {}
        this.store.firebaseData = {}
        this.store.myNotifies = {}

      }).catch((error) => {
        console.log(error)
      });
    },
    completeDeleteProcess(){
      this.deleteAccFirebase()
    },
    deleteAccLastly(){

      const check = ['email','deleteDescription'].every(
        (key) => key in this.deleteConfirmData
      )
      if(check){
        Object.assign(this.store.myData,{
          deleteDescription:this.deleteConfirmData.deleteDescription
        })
      }
      const allBody = {
        userData:this.store.myData,
        deleteConfirmData:this.deleteConfirmData
      }
      console.log('allB',allBody)
      const id = this.store.firebaseData.uid
      const url = this.store.baseUrl
      ///:firebaseId/removeMyAllData
      axios.put(`${url}/app/${id}/removeMyAllData`, allBody)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    /*       this.$q.dialog({
        dark: true,
        title: 'Warning',
        maximized:this.store.mobileActive ? true : false,
        fullHeight:this.store.mobileActive ? true : false,
        message: 'Enter Your Email for Delete.',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        const check = String(this.store.firebaseData.email ?? this.store.myData.email) === String(data) ? true :  false
        if(check){
          this.deleteAccFirebase()
        }else{
          this.$q.notify({
            type:'negative',
            message:'Try Again ! Wrong Email',
            icon:'info'
          })
          this.removeCodeVal()
        }
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      }) */
    deleteAccountConfirm(){
      this.deleteConfirmDialogActive =! this.deleteConfirmDialogActive
    },
    syncCodeValAndCodeCorrect(){
      if(this.checkCodeCorrect() === true){
        const check = this.checkAuthentication.codeVal === this.checkAuthentication.codeValCorrect ? true : false
        if(check){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    removeCodeVal(){
      delete this.checkAuthentication.codeVal
      delete this.checkAuthentication.codeValCorrect
    },
    newClass(){
      const check = this.syncCodeValAndCodeCorrect() === true ? true : false
      if(check === true){
        return 'text-green-4 text-weight-bold'
      }else{
        return 'text-red-4 text-weight-bold'
      }
    },
    checkCodeCorrect(){
      const check = ['codeVal','codeValCorrect'].every(
        (key) => key in this.checkAuthentication
      )
      if(check){
        return true
      }else{
        return false
      }
    },
    sendCodeDeleteCheck(){
      const url = this.store.baseUrl
      const id = this.store.firebaseData.uid
      ///:firebaseId/sendCodeForDelete
      axios.put(`${url}/app/${id}/sendCodeForDelete`)
        .then(res => {
          console.log(res)

          this.checkAuthentication.codeValCorrect = res.data.allBody.newBody.vertificationId
          this.emailSendedNotify()
        })
        .catch(err => {
          console.log(err)
        })
    },
    deleteAcc(){
      this.$q.dialog({
        title:'Warning',
        message:'Are You Sure For Delete Current Account ?',
        cancel:true,
        maximized:this.store.mobileActive ? true : false,
        fullHeight:this.store.mobileActive? true : false
      }).onOk(() => {
        this.sendCodeDeleteCheck()
      })
    }
  },
  created(){

  }
}
</script>

<style>

</style>
