<template>
  <q-page class="myloginpage">
    <div class="row">
      <div class="col-5"
        v-if="this.randomImageUrl && !this.store.mobileActive"
      >
        <q-img
          v-on:click="changeImage"
          loading="lazy"
          spinner-color="white"
          :style="{
            'height':(this.$q.screen.height - 100) + 'px'
          }"
          style="object-fit:cover;width:100%;"
          :src="this.randomImageUrl"
        ></q-img>
      </div>
      <div class="col" style="margin:0 auto;">
        <transition-group appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
          <signIn v-if="this.store.loginPageCurrentOption.signActive"/>
          <signUp v-else/>
      </transition-group>
      </div>
    </div>
  </q-page>
</template>

<script>
import signUp from 'src/components/signUp.vue';
import signIn from 'src/components/signIn.vue';
import { useCounterStore } from 'src/stores/store';
export default {
  components:{
    signIn,
    signUp
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      randomImageList:[],
      randomImageUrl:'',
      currentStatus:'login'
    }
  },
  beforeRouteLeave (to,from){
    const check = 'uid' in this.store.firebaseData
    if(!check){
      this.$router.replace({path:'/login'})
    }
  },
  methods:{
    changeImage(){
      this.getRandomImages()
    },
    randomLoginImage(){
      const randomNumber = Math.floor(Math.random() * 15);
      const randomImage = this.randomImageList[randomNumber]

      const imageUrl = randomImage.src.original
      console.log(imageUrl)
      this.randomImageUrl = imageUrl
    },
    async getRandomImages(){
      /*       fetch("https://api.pexels.com/v1/search?query=people",{
        headers: {
          Authorization: this.store.pexelsApiKey
        }
      })
        .then(resp => {
          return resp.json()
        })
        .then(data => {
          console.log(data)
        }) */
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
    }
  },
  created(){
    this.getRandomImages()
  },
  watch:{

  }
}
</script>

<style>
::-webkit-scrollbar {
  display: none;
  width: 0;  /* Remove scrollbar space */
  background: transparent;  /* Optional: just make scrollbar invisible */
}
/* Optional: show position indicator in red */
::-webkit-scrollbar-thumb {
  background: #FF0000;
}
.myloginpage{
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-y: scroll;
}
</style>
