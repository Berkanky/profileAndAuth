<template>
  <q-layout view="lHh LpR fFf">
    <q-header elevated class="bg-grey-9 text-white">
      <q-toolbar>
        <q-btn
          v-if="this.$route.path !== '/login'" dense flat round
          :icon="leftDrawerOpen  === true ? 'menu' : 'menu_open'"
          @click="toggleLeftDrawer" />

        <q-toolbar-title>

        </q-toolbar-title>
        <q-space></q-space>
        <q-btn icon="logout" flat v-on:click="logoutButton" v-if="this.store.checkAccStatus()"></q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
        class="bg-grey-2"
        v-model="this.leftDrawerOpen"
        :width="300"
        show-if-above
        :breakpoint="400"
      >
        <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
          <q-list class="">
            <q-item
              v-on:click="goSelected(data)"
              :class="this.checkCurrentPage(data)"
              v-for="(data,key) in this.options" :key="key"
              clickable v-ripple>
              <q-item-section avatar>
                <q-icon :name="data.icon"/>
              </q-item-section>
              <q-item-section>
                {{data.label}}
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <q-img
          loading="lazy"
          spinner-color="white"
          v-on:click="this.randomLoginImage()"
          class="absolute-top"
          :src="this.randomImageUrl ?? 'https://cdn.quasar.dev/img/material.png'"
          style="height: 150px;object-fit:cover;">
          <div class="absolute-bottom">
  <!--           <q-avatar size="65px" class="q-mb-sm">
              <userImage />
            </q-avatar> -->
            <div class="text-weight-bold">{{ this.store.firebaseData.displayName ?? this.myData.displayName ?? 'No Name' }}</div>
            <div>@{{ this.myData.email ?? this.store.firebaseData.email ?? 'No Email' }}</div>
          </div>
        </q-img>
      </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer class="bg-grey-9 text-white">
      <q-toolbar>
        <q-toolbar-title>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import userImage from 'src/components/userImage.vue';
import axios from 'axios'
import { getAuth, signOut } from "firebase/auth";
import { ref } from 'vue'
import { useCounterStore } from 'src/stores/store'
export default {
  components:{
    userImage
  },
  setup () {
    const leftDrawerOpen = ref(true)
    const store = useCounterStore()
    return {
      store,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  },
  data:function(){
    return{
      leftDrawerOpen:false,
      options:[
        {id:1,label:'Home',icon:'home',name:'home'},
        {id:2,label:'Profile',icon:'person',name:'profile'},
        {id:3,label:'My Resume',icon:'info',name:'resume'},
        {id:4,label:'Check Jobs',icon:'work',name:'advertises'}
      ],
      myData:{},
      randomImageUrl:'',
      randomImageList:[]
    }
  },
  mounted(){
    const check = this.store.mobileActive === false ? true : false
    if(check){
      this.leftDrawerOpen = true
    }
  },
  created(){
    this.getRandomImages()
    console.log(this.$route)
  },
  methods:{
    randomLoginImage(){
      const randomNumber = Math.floor(Math.random() * 15);
      const randomImage = this.randomImageList[randomNumber]

      const imageUrl = randomImage.src.original
      console.log(imageUrl)
      this.randomImageUrl = imageUrl
    },
    async getRandomImages(){
      const res = await fetch(`https://api.pexels.com/v1/search?query=new york`,{
        headers:{
          Authorization:this.store.pexelsApiKey
        }
      })

      const resData  = await res.json()
      this.randomImageList = resData.photos
      this.randomImageList.forEach(element => {
        const check = 'url' in element
        if(!check){
          this.randomImageList = this.randomImageList.filter(
            object => object.id !== element.id
          )
        }
      });
      this.randomLoginImage()
      console.log(this.randomImageList)
    },
    watchMyData(){
      this.$watch('store.myData',(newVal) => {
        if(newVal){
          this.myData = newVal
        }
      }, {
        immediate:true, deep:true
      })
    },
    goSelected(data){
      const id = this.store.firebaseData.uid
      if(data.id === 1){
        this.$router.push(
          {
            path:'/home'
          }
        )
      }else if(data.id === 2){
        this.$router.push(
          {
            path:`/profile/${id}`,
            params:
              {
                id:id
              }
          }
        )
      }else if(data.id === 3){
        this.$router.push(
          {
            path:`/resume/${id}`,
            params:{
              id:id
            }
          }
        )
      }else if(data.id === 4){
        this.$router.push(
          {
            path:'/advertises'
          }
        )
      }
    },
    checkCurrentPage(data){
      const currentRouter = this.$route.name
      if(data.name === currentRouter){
        return 'bg-grey-8 text-white'
      }else{
        return 'text-grey-7'
      }
    },
    checkUserInOrNot(){
      const check = this.store.firebaseData.hasOwnProperty('uid')
      if(!check){
        this.leftDrawerOpen = false
      }
      return check
    },
    logoutUpdateFunction(){
      axios.put(`${this.store.baseUrl}/app/${this.store.firebaseData.uid}/logoutUpdate`)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    logoutButton(){
      const auth = getAuth();
      signOut(auth).then(() => {
        // Sign-out successful.
        this.logoutUpdateFunction()
        this.store.firebaseData = {}
        this.store.myData = {}
        this.leftDrawerOpen = false
        this.$router.replace({path:'/login'})
      }).catch((error) => {
        // An error happened.
      });
    }
  }
}
</script>
