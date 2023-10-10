<template>
  <q-card>
    <q-card-section>
      <q-input
        color="grey-8"
        v-on:keyup="searchUserFunction"
        v-model="this.searchUser" filled label="Search User"
      >
        <template v-slot:prepend>
          <q-icon name="search"></q-icon>
        </template>
        <template v-slot:append>
          <q-btn icon="remove" flat color="red-4" v-if="this.searchUser" v-on:click="clearSearch"></q-btn>
        </template>
      </q-input>
    </q-card-section>
    <q-card-section v-if="this.store.findedUsers.length">
      <div class="q-pa-sm text-weight-bold text-grey-6">
        <q-icon name="filter_list"></q-icon>
        Results - ( {{ this.store.findedUsers.length }} )
      </div>
    </q-card-section>
    <q-card-section>
      <q-card
        v-for="(data,key) in this.store.findedUsers" :key="key"
        class="q-mt-xs" flat bordered>
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img
              v-if="data.userDetail.userImage || data.userDetail.googleImage"
              :src="data.userDetail.userImage ?? data.userDetail.googleImage">
            <q-btn icon="person" round color="grey-8"></q-btn>
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            @{{ data.userDetail.email}}
          </q-item-label>
          <q-item-label caption class="text-weight-bold">
            {{data.userDetail.active === true ? 'Online' : data.userDetail.lastLoginDate}}
          </q-item-label>
          <q-item-label caption class="">

          </q-item-label>
        </q-item-section>
      </q-item>
      <q-separator />
      <q-card-section horizontal>
        <q-card-section class="col">

        </q-card-section>
        <q-separator vertical />
        <q-card-section class="col-4" horizontal>
          <q-btn
            :disable="this.store.myData._id === data.userDetail._id ? true : false"
            v-on:click="removeFriend(data)"
            icon="person_remove" color="red-4" size="sm" class="col" v-if="this.checkFriendOrNot(data)"></q-btn>
          <q-btn
            :disable="this.store.myData._id === data.userDetail._id ? true : false"
            v-on:click="addFriend(data)"
            icon="person_add" color="green-4" size="sm" class="col" v-else></q-btn>
        </q-card-section>
      </q-card-section>
    </q-card>
    </q-card-section>
    <q-card-section>
      <q-card-section>
        <div class="q-pa-sm text-grey-6 text-weight-bold">
          <q-icon name="groups" size="lg"></q-icon>
          Friends
        </div>
      </q-card-section>
      <q-card
        style="border-radius:7px;"
        v-for="(data,key) in this.store.friendsList" :key="key"
        class="q-mt-xs" flat bordered>
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img
              v-if="data.userDetail.userImage || data.userDetail.googleImage"
              :src="data.userDetail.userImage ?? data.userDetail.googleImage">
            <q-btn icon="person" round color="grey-8"></q-btn>
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            @{{ data.userDetail.email}}
          </q-item-label>
          <q-item-label caption class="text-weight-bold">
            {{data.userDetail.active === true ? 'Online' : data.userDetail.lastLoginDate}}
          </q-item-label>
          <q-item-label caption class="">

          </q-item-label>
        </q-item-section>
      </q-item>
      <q-separator />
      <q-card-section horizontal>
        <q-card-section class="col">

        </q-card-section>
        <q-separator vertical />
        <q-card-section class="col-4" horizontal>
          <q-btn
            v-on:click="removeFriend(data)"
            icon="person_remove" color="red-4" size="sm" class="col" v-if="this.checkFriendOrNot(data)"></q-btn>
          <q-btn
            v-on:click="addFriend(data)"
            icon="person_add" color="green-4" size="sm" class="col" v-else></q-btn>
        </q-card-section>
      </q-card-section>
    </q-card>
    </q-card-section>
  </q-card>
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
      searchUser:'',

    }
  },
  methods:{
    getMyId(){
      const id = this.$route.params.id
      this.store.getMyFriendsList(id)
    },
    removeFriend(data){
      const userData = data
      this.store.addFriendOrRemove(userData)

      const check = this.store.friendsList.some(
        object => object.userDetail._id === data.userDetail._id
      )
      if(check){
        this.store.friendsList = this.store.friendsList.filter(
          object => object.userDetail._id !== data.userDetail._id
        )
      }
    },
    addFriend(data){
      const userData = data
      this.store.addFriendOrRemove(userData)
    },
    checkFriendOrNot(data){
      const check = 'friendActive' in data
      if(check){
        if(data.friendActive !== null && data.friendActive !== ''){
          const secCheck = data.friendActive === true ? true : false
          return secCheck
        }else{
          return false
        }
      }else{
        return false
      }
    },
    searchUserFunction(){
      if(this.searchUser){
        const allBody = {
          searchUser:this.searchUser ?? ''
        }
        ///:firebaseId/findUser
        const id = this.store.firebaseData.uid
        axios.put(`${this.store.baseUrl}/app/${id}/findUser`,allBody)
          .then(res => {
            console.log(res)
            this.store.findedUsers = res.data.resBody.findedUsers
          })
          .catch(err => {
            console.log(err)
          })
      }else{
        this.store.findedUsers = []
      }
    },
    clearSearch(){
      this.searchUser = ''
      this.store.findedUsers = []
    },
  },
  created(){
    this.getMyId()
  }
}
</script>

<style>

</style>
