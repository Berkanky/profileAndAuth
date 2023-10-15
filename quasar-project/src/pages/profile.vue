<template>
  <q-page>
    <div
      style="margin:0 auto;"
      :style="{
        'width':this.store.mobileActive ? '100%' : '90%'
      }"
      class="row">
      <div class="col-3">
        <q-list
          bordered
        >
            <q-item
              v-on:click="selectOption(data)"
              :class="this.checkSelectedLeftBar(data)"
              v-for="(data,key) in this.leftColOptions" :key="key"
              clickable v-ripple>
              <q-item-section avatar>
                <q-icon :name="data.icon" />
              </q-item-section>
              <q-item-section>
                {{data.label}}
              </q-item-section>
            </q-item>
          </q-list>
      </div>
      <div class="col">
       <!--  <profileDetailComp v-if="this.selectedOption.id === 2"/> -->
        <myFriends v-if="this.selectedOption.id === 3"/>
        <accountManage v-if="this.selectedOption.id === 4"/>
        <myJobAdvertises v-if="this.selectedOption.id === 5"/>
      </div>
      <div class="col-2 q-ml-md">
        <q-card>
          <q-card-section>
            <q-btn
              v-on:click="logoutButton"
              icon="logout" color="grey-8" class="full-width" no-caps label="Logout"></q-btn>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import myJobAdvertises from "src/components/myJobAdvertises.vue";
import accountManage from "src/components/accountManage.vue";
import myFriends from "src/components/myFriends.vue";
import { getAuth, signOut } from "firebase/auth";
import profileDetailComp from 'src/components/profileDetailComp.vue';
import { useCounterStore } from 'src/stores/store';
export default {
  components:{
    myJobAdvertises,
    profileDetailComp,
    myFriends,
    accountManage
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      leftColOptions:[
        {id:1,label:'Overview',icon:'trending_up'},
        {id:2,label:'Settings',icon:'settings'},
        {id:3,label:'Friends',icon:'groups'},
        {id:4,label:'Account Settings',icon:'settings'},
        {id:5,label:'Give Job Advertise',icon:'work'}
      ],
      selectedOption:{
        id:3,
      }
    }
  },
  methods:{
    logoutButton(){
      const auth = getAuth();
      signOut(auth).then(() => {
        // Sign-out successful.
        this.logoutUpdateFunction()
        this.store.firebaseData = {}
        this.store.myData = {}
        this.$router.replace({path:'/login'})
      }).catch((error) => {
        // An error happened.
      });
    },
    selectOption(data){
      this.selectedOption = data
    },
    checkSelectedLeftBar(data){
      const check = this.selectedOption.hasOwnProperty('id')
      if(check){
        if(this.selectedOption.id === data.id){
          return 'bg-grey-8 text-white'
        }else{
          return ''
        }
      }else{
        return ''
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
