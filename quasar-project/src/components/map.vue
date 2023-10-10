<template>
  <div
    v-if="this.myLocationVals.length"
    :style="{
      'height':this.store.mobileActive ? this.$q.screen.height + 'px'  : '450px'
    }"
    style="width:100%;">
    <l-map
      :style="{
        'border-radius':this.store.mobileActive ? '0px' : '7px'
      }"
      :use-global-leaflet="false"
      ref="map" v-model:zoom="zoom" :center="this.myLocationVals">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>
      <l-marker
        @dragend="onMarkerDragEnd"
        draggable="true"
        :lat-lng="this.myLocationVals.length ? this.myLocationVals : this.myLocationVals" v-if="this.myLocationVals.length === 2">
        <l-popup>
          {{ this.store.myData.locationAdressDetail }}
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script>
import { useCounterStore } from "src/stores/store";
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";

export default {
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  components: {
    LMap,
    LMarker,
    LTileLayer,
    LPopup
  },
  data() {
    return {
      zoom: 11,
      myLocationVals:[],
      newLocationLatLNg:{}
    };
  },
  methods:{
    onMarkerDragEnd(e) {
      // Marker'ın yeni koordinatlarını alın.
      const newLatLng = e.target.getLatLng();
      this.newLocationLatLNg = newLatLng
      // Marker'ın yeni koordinatlarını güncelleyin.
      //console.log(newLatLng)
      this.$emit('newLatLng',newLatLng)
    },
    getMyLocation(){
      this.$watch('store.myData',(newVal) => {
        if(newVal){
          const checkFirst = 'locationAdressDetail' in newVal
          if(checkFirst){
            const check = ['lat','lng'].every(
              (key) => key in newVal.locationAdressDetail
            )
            if(check){
              this.myLocationVals = [newVal.locationAdressDetail.lat,newVal.locationAdressDetail.lng]
              console.log(this.myLocationVals)
            }
          }
        }
      })
    }
  },
  created(){
    this.getMyLocation()
  },
  watch:{
    newLocationLatLNg:{
      handler(newVal){
        if(newVal){
          //
        }
      },
      immediate:true, deep:true
    },
    'store.myData':{
      handler(newVal){
        if(newVal){
          const checkFirst = 'locationAdressDetail' in newVal
          if(checkFirst){
            const check = ['lat','lng'].every(
              (key) => key in newVal.locationAdressDetail
            )
            if(check){
              this.myLocationVals = [newVal.locationAdressDetail.lat,newVal.locationAdressDetail.lng]
              console.log(this.myLocationVals)
            }
          }
        }
      },
      immediate:true, deep:true
    }
  }
};
</script>

<style></style>
