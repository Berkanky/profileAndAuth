<template>
  <q-dialog
    v-model="this.store.zoomImageActive"
    persistent
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
  >
    <q-card
      style="width:100%;"
    >
<!--       <q-card-section class="text-right">
        <q-btn icon="cancel" flat color="grey-8" v-on:click="goBack"></q-btn>
      </q-card-section> -->
<!--       <q-separator size="1.5px"></q-separator>
      <q-img
          loading="lazy"
          spinner-color="white"
          v-on:mouseleave="mouseLeaveFunc"
          v-on:mouseover="mouseOnFunc"
          style="object-fit:cover;height:100%;"
          :src="this.store.selectedImage.imageUrl ?? ''"
        >
        <transition-group appear enter-active-class="animated fadeIn slower" leave-active-class="animated fadeOut slower">
          <div class="absolute-center bg-transparent" v-if="this.fullScreenActive">
            <q-btn
              v-on:click="goZoom"
              icon="fullscreen" color="dark"></q-btn>
          </div>
        </transition-group>
        </q-img> -->
        <q-carousel
          swipeable
          animated
          arrows
          v-model="slide"
          v-model:fullscreen="fullscreen"
          infinite
        >
          <q-carousel-slide
            style="object-fit:cover;"
            :name="1" :img-src="this.store.selectedImage.imageUrl" />

          <template v-slot:control>
            <q-carousel-control
              position="bottom-right"
              :offset="[18, 18]"
            >
              <q-btn
                push round dense color="dark" text-color="white"
                :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
                @click="fullscreen = !fullscreen"
              />
            </q-carousel-control>
            <q-carousel-control
              position="top-right"
              :offset="[18, 18]"
            >
              <q-btn
                push round dense color="dark" text-color="white"
                icon="remove" v-on:click="goBack"></q-btn>
            </q-carousel-control>
          </template>
        </q-carousel>
    </q-card>
  </q-dialog>
</template>

<script>
import axios from 'axios';
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
      fullScreenActive:false,
      fullscreen:false,
      slide:1,
    }
  },
  mounted() {
    document.addEventListener('keyup', this.onKeyUp);
  },
  beforeDestroy() {
    document.removeEventListener('keyup', this.onKeyUp);
  },
  methods:{
    onKeyUp(event) {
      if (event.keyCode === 27) {
        this.fullscreen = false;
      }
    },
    goZoom(){
      this.$q.fullscreen.request()
        .then(() => {
          // success!
        })
        .catch(err => {
          // oh, no!!!
        })
    },
    mouseLeaveFunc(){
      this.fullScreenActive = false
    },
    mouseOnFunc(){
      this.fullScreenActive = true
    },
    goBack(){
      this.store.zoomImageActive = false
    }
  },
  created(){

  },
  watch:{
    fullScreenActive:{
      handler(newVal){
        console.log(newVal)
      },
      immediate:true, deep:true
    }
  }
}
</script>

<style>

</style>
