<style></style>

<template>
  <q-card>
    <q-card-section>
      <q-card flat>
        <q-card-section horizontal>
          <q-card-section class="col-3">
            <!--             <q-img
              style="object-fit:cover;border-radius:4px;height:160px;"
              :src="this.store.selectedProfileImageDetail.url ?? this.store.myData.userImage ?? this.store.firebaseData.photoURL "></q-img> -->
            <q-avatar size="120px" v-on:click="changeImage">
              <img
                style="object-fit:Cover;"
                :src="!this.store.selectedProfileImageDetail.url ?   this.getUserImage() : this.store.selectedProfileImageDetail.url "
                alt="">
            </q-avatar>
          </q-card-section>
          <q-card-section class="col text-capitalize">
            <div class="text-subtitle2 text-weight-bold">
              {{ this.store.firebaseData.displayName ?? 'No Name' }}
            </div>
            <div class="text-caption">
              @{{ this.store.firebaseData.email ?? 'No Email' }}
            </div>
            <div class="text-caption  text-grey-6">
              Last Seen {{ this.store.myData.lastLoginDate ??  '' }}
            </div>
            <div class="q-mt-xs">
              <q-file
                class=""
                v-model="this.selectFile"
                label="Pick Image"
                filled
                counter
                @update:model-value="selectFileFunction"
                color="blue-4"
              >
                <template v-slot:prepend>
                  <q-icon name="person"></q-icon>
                </template>
                <template v-slot:append>
                  <q-btn
                    v-if="this.selectFile"
                    icon="remove" flat color="red-4" size="xs" v-on:click="clearSelectedImage"></q-btn>
                </template>
              </q-file>
              <q-btn icon="camera" flat color="grey-8" v-on:click="openCamera" no-caps label="Camera"></q-btn>
            </div>
          </q-card-section>
          <q-card-section class="col text-right">
            <div class="text-caption text-grey-6 text-weight-bold">
              Joined At {{ this.store.myData.createdDate ?? '' }}
            </div>
            <div class="text-caption text-grey-6 text-weight-bold" v-if="this.checkLastUpdateDate()">
              Last Update Date - {{ this.store.myData.lastProfileUpdatedDate }}
            </div>
          </q-card-section>
        </q-card-section>
      </q-card>
    </q-card-section>
    <q-card-section class="">
<!--               <q-btn icon="camera" flat color="grey-8" v-on:click="openCamera" no-caps label="Camera"></q-btn>
 -->
      <cameraVue
        @updateActive="getupdateActive"
        v-if="this.store.cameraDialogActive"/>
    </q-card-section>
    <q-card-section class="row">
      <q-card
        flat
        style="height:150px;object-fit:cover;"
        class="col-4 q-pa-xs"
        v-for="(data,key) in this.store.myData.myImages" :key="key"
      >
        <q-img
          style="heigth:100%;"
          :src="data.imageUrl"
        >
        <div class="absolute-center full-width">
          <q-btn-dropdown
            class="full-width"
            icon="more_vert"
            flat
            color="white">
            <q-list>
              <q-item
                v-for="(menu,key) in this.options" :key="key"
                clickable v-close-popup @click="selectOption(menu,data)">
                <q-item-section>
                  <q-item-label>{{menu.label}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            </q-btn-dropdown>
          </div>
        </q-img>
      </q-card>
    </q-card-section>
    <q-card-section>
      <q-btn
        icon-right="expand_more"
        icon="settings" color="grey-5" label="Settings" no-caps outline></q-btn>
      <q-separator size="1.5px" color="grey-5"></q-separator>
    </q-card-section>
    <q-card-section class="row">
      <q-input
        class="col"
        color="blue-4"
        v-model="this.newData.displayName"
        :label="this.store.myData.displayName ?? ''"
        outlined
      >
        <template v-slot:prepend>
          <q-icon name="person"></q-icon>
        </template>
      </q-input>
      <q-input
        class="col q-ml-xs"
        color="blue-4"
        v-model="this.newData.userName"
        :label="this.store.myData.userName ?? 'Enter New UserName'"
        outlined
      >
        <template v-slot:prepend>
          <q-icon name="person"></q-icon>
        </template>
      </q-input>
    </q-card-section>
    <q-card-section class="row">
      <q-input
        class="col"
        color="blue-4"
        v-model="this.newData.name"
        :label="this.store.myData.name ?? 'Enter New Name'"
        outlined
      >
        <template v-slot:prepend>
          <q-icon name="person"></q-icon>
        </template>
      </q-input>
      <q-input
        class="col q-ml-xs"
        color="blue-4"
        v-model="this.newData.surName"
        :label="this.store.myData.surName ?? 'Enter New Last Name'"
        outlined
      >
        <template v-slot:prepend>
          <q-icon name="person"></q-icon>
        </template>
      </q-input>
    </q-card-section>
    <q-card-section>
      <q-input filled :label="this.store.firebaseData.email" disable>
        <template v-slot:prepend>
          <q-icon name="email"></q-icon>
        </template>
      </q-input>
      <q-input
        type="textarea"
        outlined
        class="q-mt-sm"
        color="blue-4"
        :label="this.store.myData.userDescription ?? 'About Me'"
        v-model="this.newData.userDescription"
      >
        <template v-slot:prepend>
          <q-icon name="info"></q-icon>
        </template>
      </q-input>
      <q-input outlined class="q-mt-sm" :label="this.store.myData.bio ?? 'Enter BIO'" color="blue-4" v-model="this.newData.bio">
        <template v-slot:prepend>
          <q-icon name="info"></q-icon>
        </template>
      </q-input>
      <q-select
        v-model="this.newData.dialCode"
        :label="this.store.myData.dialCode ?? 'Enter Dial Code'"
        :options="this.onlyDialCodes"
        color="grey-8"
        outlined
        class="q-mt-sm"
        use-input
        @filter="filterForSelectDialCode"
        @update:model-value="selectDialCode"
      >
        <template v-slot:prepend>
          <q-icon name="info"></q-icon>
        </template>
      </q-select>
      <q-input
        color="grey-8"
        class="q-mt-sm"
        outlined
        v-model="this.newData.phoneNumber"
        :label="this.store.myData.phoneNumber ?? 'Enter Phone Number'"
        mask="(###) ### - ####"
        unmasked-value
      >
        <template v-slot:prepend>
          <q-icon name="call"></q-icon>
        </template>
      </q-input>
    </q-card-section>
    <q-card-section>
      <div class="text-subtitle2 text-grey-7 text-weight-bold q-pa-sm row">
        <div>
          <q-icon name="location_on"></q-icon>
          My Address
        </div>
        <q-space></q-space>
        <q-btn icon="location_on" flat color="grey-8" v-on:click="getCurrentLocationLatLng"></q-btn>
        <q-btn icon="delete_forever" flat color="red-4" v-on:click="removeMyLocation"></q-btn>
      </div>
    </q-card-section>
    <q-card-section>
      <q-input
        v-model="this.newLocationData.country"
        filled
        color="grey-8"
        :label="this.store.myData.locationAdressDetail ?  this.store.myData.locationAdressDetail.country : 'Enter Country'"
      >
        <template v-slot:prepend>
          <q-icon name="location_on"></q-icon>
        </template>
      </q-input>
      <q-input
        class="q-mt-xs"
        v-model="this.newLocationData.city"
        filled
        color="grey-8"
        :label="this.store.myData.locationAdressDetail ?  this.store.myData.locationAdressDetail.city : 'Enter City'"
      >
        <template v-slot:prepend>
          <q-icon name="location_on"></q-icon>
        </template>
      </q-input>
      <q-input
        class="q-mt-xs"
        v-model="this.newLocationData.address"
        type="textarea"
        color="grey-8"
        filled
        :label="this.store.myData.locationAdressDetail ?  this.store.myData.locationAdressDetail.address : 'Enter Address'"

      >
        <template v-slot:prepend>
          <q-icon name="location_on"></q-icon>
        </template>
      </q-input>
    </q-card-section>
    <q-card-section>
      <mapVue v-if="this.checkMyLocation()"/>
    </q-card-section>
    <transition-group appear enter-active-class="animated fadeIn slower" leave-active-class="animated fadeOut slower">
      <q-card-section class="text-right" v-if="this.checkNewData()">
      <q-btn icon="clear_all" label="Clear" no-caps color="red-4" v-on:click="clearAll"></q-btn>
      <q-btn icon="edit" label="Update" no-caps color="red-4" flat v-on:click="updateMyData"></q-btn>
    </q-card-section>
    </transition-group>
  </q-card>
</template>

<script>
import mapVue from '../components/map.vue'
import cameraVue from './camera.vue';
import { useCounterStore } from 'src/stores/store';
import axios from 'axios'
export default {
  components:{
    cameraVue,
    mapVue
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      selectFile:'',
      newData:{},
      userCurrentImage:'',
      newLocationData:{},
      options:[
        {id:1,label:'Remove'},
        {id:2,label:'Update Profile Pic'}
      ],
      onlyDialCodes:[]
    }
  },
  methods:{
    selectDialCode(val){
      if(val){
        this.newData.dialCode = val
      }
    },
    filterForSelectDialCode(val, update){
      update(() => {
        if(val){
          const result = this.onlyDialCodes.filter(
            object => (object.toLowerCase()).includes(val.toLowerCase())
          )
          if(result){
            this.onlyDialCodes = result
          }
        }else{
          this.getAllDialCodes()
        }
      })
    },
    checkMyLocation(){
      const check = this.store.myData.hasOwnProperty('locationAdressDetail')
      if(check){
        const secCheck = ['lat','lng'].every(
          (key) => key in this.store.myData.locationAdressDetail
        )
        if(secCheck){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    removeMyLocation(){
      const check = this.store.myData.hasOwnProperty('locationAdressDetail')
      if(check){
        const secCheck = ['lat','lng'].every(
          (key) => key in this.store.myData.locationAdressDetail
        )
        if(secCheck){
          ///:firebaseId/removeMyLocation
          axios.put(`${this.store.baseUrl}/app/${this.store.firebaseData.uid}/removeMyLocation`)
            .then(res => {
              console.log(res)
              Object.assign(this.store.myData,res.data.findme)
            })
            .catch(err => {
              console.log(err)
            })
        }
      }
    },
    async getCurrentLocationDetails(allBody){
      const res = await fetch(`
        https://api.opencagedata.com/geocode/v1/json?q=${allBody.lat}+${allBody.lng}&key=${this.store.openCageApiKey}`
      )
      const resData = await res.json()
      const formData = {}

      const lat = allBody.lat
      const lng = allBody.lng
      const address = resData.results[0].formatted
      const country = resData.results[0].components.country
      const city = resData.results[0].components.province
      Object.assign(formData,{
        address,country,city,lat,lng,locationUpdateDate:new Date().toLocaleString()
      })

      Object.assign(this.newLocationData,formData)

      console.log(formData)
    },
    getCurrentLocationLatLng(){
      const navigator = window.navigator;
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const allBody = {
          lat:latitude,
          lng:longitude
        }
        console.log(allBody)
        this.getCurrentLocationDetails(allBody)
      });
    },
    removeImage(menu,data){
      const allBody = {
        selectedImage:data
      }
      const url = this.store.baseUrl
      const id = this.store.firebaseData.uid
      axios.put(`${url}/app/${id}/removeSelectedImage`, allBody)
        .then(res => {
          console.log(res)
          this.store.myData.myImages = this.store.myData.myImages.filter(
            object => object.imageId !== data.imageId
          )
        })
        .catch(err => {
          console.log(err)
        })
    },
    selectOption(menu,data){
      console.log('menu',menu)
      console.log('data',data)
      ///:firebaseId/removeSelectedImage
      if(menu.id === 1){
        this.removeImage(menu,data)
      }else if(menu.id === 2){
        this.newData.userImage  = data.imageUrl
      }

    },
    getUserImage(){
      const image =  this.store.myData.userImage ?? this.store.firebaseData.photoURL ?? ''
      this.userCurrentImage = image
      return image
    },
    changeImage(){
      let userImageList =
      [
        {
          image : this.store.myData.userImage ?? ''
        },
        {
          image:this.store.myData.googleImage ?? this.store.firebaseData.photoURL ?? ''
        }
      ]

      /* const indexNumber = userImageList.findIndex(
        (object) => object.image === this.userCurrentImage
      ) */

      userImageList = userImageList.filter(
        object => object.image !== this.userCurrentImage
      )

      const randomNumber = Math.floor(Math.random() * userImageList.length);

      this.userCurrentImage = userImageList[randomNumber].image

    },
    getupdateActive(data){
      if(data){
        const firebaseId = this.$route.params.id
        this.store.getUserDetailFromDB(firebaseId)
      }
    },
    openCamera(){
      this.store.cameraDialogActive =! this.store.cameraDialogActive
    },
    checkLastUpdateDate(){
      const check = this.store.myData.hasOwnProperty('lastProfileUpdatedDate')
      if(check){
        const secChcek = this.store.myData.lastProfileUpdatedDate !== '' && this.store.myData.lastProfileUpdatedDate !== null ? true : false
        if(secChcek){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    updateMyData(){
      const allBody = {
        newData:this.newData
      }
      const id = this.store.firebaseData.uid
      axios.put(`${this.store.baseUrl}/app/${id}/updateMyData`, allBody)
        .then(res => {
          console.log(res)
          Object.assign(this.store.myData,res.data.findmyacc)
          this.clearAll()
          //this.getMyDB()
        })
        .catch(err =>{
          console.log(err)
        })
    },
    clearSelectedImage(){
      this.store.selectedProfileImageDetail = {}
      this.selectFile = ''
      const check = this.newData.hasOwnProperty('userImage')
      if(check){
        delete this.newData.userImage
      }
    },
    clearAll(){
      this.newData = {}
      this.store.selectedProfileImageDetail = {}
      this.selectFile = ''
      this.newLocationData = {}
    },
    checkNewData(){
      const check = Object.keys(this.newData).length
      if(check > 0){
        return true
      }else{
        return false
      }
    },
    selectFileFunction(val){
      if(val){
        const newObject = {
          _key: val._key ?? '',
          lastModified: val.lastModified ?? '',
          lastModifiedDate: val.lastModifiedDate ?? '',
          name: val.name ?? '',
          size: val.size ?? '',
          type: val.type ?? '',
          webKitRelativePath: val.webKitRelativePath ?? '',
        };
        const reader = new FileReader();
        reader.onloadend = () => {
            // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
              Object.assign(newObject,{
                url : reader.result
              })
              Object.assign(this.store.selectedProfileImageDetail,newObject)

              console.log('selectedProfileImageDetail',this.store.selectedProfileImageDetail)
        };
        reader.readAsDataURL(val);
      }
    },
    getMyDB(){
      this.$watch('store.firebaseData',(newVal) => {
        if(newVal){
          const check = 'uid' in newVal
          if(check){
            const firebaseId = newVal.uid
            this.store.getUserDetailFromDB(firebaseId)
          }
        }
        },{
          immediate:true, deep:true
        }
      )
    },
    getAllDialCodes(){
      const url = this.store.baseUrl
      const id = this.store.firebaseData.uid
      axios.get(`${url}/app/${id}/getAllDialCodes`)
        .then(res => {
          console.log(res)
          this.onlyDialCodes = res.data.onlyDialCodeList
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created(){
    this.getMyDB()
  },
  watch:{
    'store.firebaseData':{
      handler(newVal){
        if(newVal){
          const check = 'uid' in newVal
          if(check){
            this.getAllDialCodes()
          }
        }
      },
      immediate:true, deep:true
    },
    newLocationData:{
      handler(newVal){
        if(newVal){
          const check = ['city','country','address'].every(
            (key) => key in newVal
          )
          if(check){
            Object.assign(this.newData,{
              locationAdressDetail:newVal
            })
            console.log(this.newData)
          }
        }
      },
      immediate:true, deep:true
    },
    'store.myData':{
      handler(newVal){
        if(newVal){
          this.getUserImage()
        }
      },
      immediate:true, deep:true
    },
    newData:{
      handler(newVal){
        if(newVal){
          console.log(newVal)
        }
      },
      immediate:true, deep:true
    },
    'store.selectedProfileImageDetail':{
      handler(newVal){
        if(newVal){
          const check = newVal.hasOwnProperty('url')
          if(check){
            Object.assign(this.newData,{
              userImage:newVal.url
            })
          }
        }
      },
      immediate:true, deep:true
    }
  }
}
</script>


