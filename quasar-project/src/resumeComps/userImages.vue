<template>
  <q-card
    :style="{
      'width':this.store.mobileActive ? '100%' : '600px',
      'margin':this.store.mobileActive ? '0 auto' : '0% auto'
    }"
  >
    <q-card-section horizontal>
      <q-card-section class="col-4">
        <q-avatar size="140px">
          <img
            style="object-fit:cover;"
            :src="this.store.myData.userImage ?? this.store.firebaseData.photoURL"
            alt="">
        </q-avatar>
      </q-card-section>
      <q-card-section class="col">
        <q-file
          rounded
          class=""
          standout="bg-dark text-white"
          v-model="this.selectFile"
          label="Pick Image"
          counter
          @update:model-value="selectFileFunction"
          color="grey-8"
        >
          <template v-slot:prepend>
            <q-icon name="collections_bookmark"></q-icon>
          </template>
        </q-file>
        <q-btn
          v-on:click="this.store.cameraDialogActive =! this.store.cameraDialogActive"
          rounded no-caps label="Camera"
          icon="camera" color="purple-4" class="full-width q-mt-md"></q-btn>
          <div class="text-overline text-weight-bold text-grey-6 q-pa-sm text-right" >
            <q-icon name="event" size="sm"></q-icon>
            {{ this.store.myData.lastProfileUpdatedDate ?? 'No Update' }}
          </div>
      </q-card-section>
    </q-card-section>
   <q-separator size="1.5px"></q-separator>
    <q-card-section>
      <q-btn-dropdown
        v-if="!this.updatePicProcessActive"
        no-caps
        icon="settings"
        split
        class="glossy full-width"
        color="teal"
        label="Options"
      >
        <q-list>
          <q-item
            v-for="(data,key) in this.options" :key="key"
            clickable v-close-popup @click="selectOption(data)">
            <q-item-section avatar>
              <q-avatar :icon="data.icon" :color="data.color" text-color="white"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{data.label}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-btn
        icon="cancel"
        v-else
        class="full-width" color="red-4" no-caps label="Cancel Update" v-on:click="cancelUpdateFunc"
      ></q-btn>
    </q-card-section>
   <q-scroll-area
    :style="{
      'height':this.store.mobileActive ? (this.$q.screen.height)/1.5 + 'px' : `${Number(100) -  Number(40)}` + 'vh'
    }"
    style="width:100%;"
   >
    <q-card-section class="row">
      <q-card
        flat
        v-touch-hold:2000.mouse="event => zoomSelectedImage(data)"
        :class="this.checkSelectedImages(data) ? '' : ''"
        v-on:click="this.updatePicProcessActive ? selectImageForUpdate(data) : selectImages(data)"
        class="col-12 col-md-4 col-sm-4 q-pa-xs"
        style="height:150px;"
        v-for="(data,key) in this.myImages" :key="key"
      >
        <q-img
          loading="lazy"
          spinner-color="white"
          :src="data.imageUrl"
          style="object-fit:cover;height:100%;"
        >
        <div class="absolute-center bg-transparent" v-if="this.checkSelectedImages(data) || this.checkSelectedImageSecond(data)">
          <q-btn icon="check" flat color="white"></q-btn>
        </div>
        </q-img>
      </q-card>
      <q-card
        flat
        class="col-12 col-md-4 col-sm-4 q-pa-xs"
        style="height:150px;"
        v-for="(data,key) in this.newAddedImages" :key="key"
      >
        <q-img
          loading="lazy"
          spinner-color="white"
          :src="data.url"
          style="object-fit:cover;height:100%;"
        >
        <div class="absolute-center bg-transparent" >
          <q-btn
            v-on:click="removeAddedImage(data)"
            icon="cancel" flat color="white"></q-btn>
        </div>
        </q-img>
      </q-card>
    </q-card-section>
  </q-scroll-area>
  <q-card-section v-if="this.checkSelectedImage()">
    <q-btn
      v-on:Click="updateProfilePic"
      icon="edit" color="green-4" no-caps label="Update Profile Pic" class="full-width"></q-btn>
  </q-card-section>
    <q-separator size="1.5px"></q-separator>
    <q-card-section horizontal class="q-pa-md">
        <q-btn
          v-on:click="this.store.currentStep = this.store.currentStep - 1"
          class="col" flat color="grey-8" label="Back" no-caps
          icon="arrow_left"></q-btn>
        <q-btn
          v-on:click="this.store.currentStep = this.store.currentStep + 1"
          icon-right="arrow_right" flat color="grey-8" label="Next" no-caps class="col"></q-btn>
      </q-card-section>
      <zoomImage v-if="this.store.zoomImageActive"/>
      <camera
        @imageAddedActive="getimageAddedActive"
        @updateActive="getupdateActive"
        v-if="this.store.cameraDialogActive"/>
  </q-card>
</template>

<script>
import zoomImage from 'src/components/zoomImage.vue';
import axios from 'axios';
import camera from 'src/components/camera.vue';
import { useCounterStore } from 'src/stores/store';
export default {
  components:{
    camera,
    zoomImage
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
      myImages:[],
      selectedImages:[],
      options:[
        {id:2,label:'Update Profile Pic',icon:'edit',color:'grey-8'}
      ],
      selectedOption:{},
      updatePicProcessActive:false,
      selectedImage:{},
      newAddedImages:[]
    }
  },
  methods:{
    zoomSelectedImage(data){
      console.log(data)
      this.store.selectedImage.imageUrl = data.imageUrl
      this.store.zoomImageActive = true
      console.log('zoomImageActive',this.store.zoomImageActive)
    },
    removeAddedImage(data){
      this.newAddedImages = this.newAddedImages.filter(
        object => object.url !== data.url
      )
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
              console.log(newObject)
              const check = newObject.type === 'image/jpeg' || newObject.type === 'image/png' ? true : false
              if(check){
                this.newAddedImages.push(newObject)
                console.log(this.newAddedImages)
              }
        };
        reader.readAsDataURL(val);
      }
    },
    updateProfilePic(){
      ///:firebaseId/updateProfilePic
      const allBody = {
        imageData:this.selectedImage
      }
      console.log('allBody',allBody)
      const url = this.store.baseUrl
      const fid = this.store.firebaseData.uid
      axios.put(`${url}/app/${fid}/updateProfilePic`, allBody)
        .then(res=>{
          console.log('updateProfilePic',res)
          Object.assign(this.store.myData,res.data.findme)
          this.selectedImage = {}
          this.updatePicProcessActive = false
          this.selectedImages = []
        })
        .catch(err => {
          console.log(err)
        })
    },
    checkSelectedImageSecond(data){
      const check = this.selectedImage.hasOwnProperty('_id')
      if(check){
        if(this.selectedImage._id === data._id){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    checkSelectedImage(){
      const check = this.selectedImage.hasOwnProperty('_id') && this.updatePicProcessActive === true ? true : false
      return check
    },
    cancelUpdateFunc(){
      this.selectedImage = {}
      this.updatePicProcessActive = false
      this.$q.notify({
        icon:'info',
        type:'negative',
        message:'Process Canceled !',
        position:'right'
      })
    },
    selectImageForUpdate(data){
      const check = this.selectedImage.hasOwnProperty('_id')
      if(!check){
        this.selectedImage = data
      }else if(this.selectedImage._id === data._id){
        this.selectedImage = {}
      }else{
        this.selectedImage = data
      }
      console.log(this.selectedImage)
    },
    removeSelectedImages(){
      ///:firebaseId/removeSelectedImages
      const url = this.store.baseUrl
      const fid = this.store.firebaseData.uid
      const allBody = {
        selectedImages:this.selectedImages
      }
      axios.put(`${url}/app/${fid}/removeSelectedImages`, allBody)
        .then(res => {
          console.log(res)

          this.myImages = this.myImages.filter(
            element => !this.selectedImages.find(
              object => object._id === element._id
            )
          )

        })
        .catch(err => {
          console.log(err)
        })
    },
    addNewAddedImages(){
      const allBody = {
        myImageList:this.newAddedImages
      }
      ///:firebaseId/addSelectedImages
      const url = this.store.baseUrl
      const fid = this.store.firebaseData.uid
      axios.put(`${url}/app/${fid}/addSelectedImages`, allBody)
        .then(res => {
          console.log(res)
          this.newAddedImages = []
          this.getUserImages()
        })
        .catch(err => {
          console.log(err)
        })
    },
    selectOption(data){
      this.selectedOption = data
      if(data.id === 1){
        this.removeSelectedImages()
      }else if(data.id === 2){
        this.selectedImages = []

/*         this.$q.notify({
          type:'positive',
          message:'Select Image For Update Profile Pic',
          icon:'info',
          position:'right'
        }) */
        this.$q.notify({
          progress: true,
          message: 'Select Picture For Update Profile Pic',
          color: 'teal',
          multiLine: true,
          position:this.store.mobileActive ? 'center' : 'bottom',
          avatar: this.store.myData.userImage ?? this.store.firebaseData.photoURL,
          actions: [
            { label: 'Close', color: 'red-4', handler: () => {
              //
            } }
          ],
          timeout:0
        })

        this.updatePicProcessActive = true
      }else if(data.id === 3){
        this.addNewAddedImages()
      }
    },
    checkSelectedImages(data){
      const check = this.selectedImages.some(
        object => object._id === data._id
      )
      return check
    },
    selectImages(data){
      const check = this.selectedImages.some(
        object => object._id === data._id
      )
      if(!check){
        this.selectedImages.push(data)
      }else{
        this.selectedImages = this.selectedImages.filter(
          object => object._id !== data._id
        )
      }
    },
    getimageAddedActive(data){
      if(data && data === true){
        this.getUserImages()
      }
    },
    getUserImages(){
      ///:firebaseId/getMyImages
      const url = this.store.baseUrl
      const fid = this.store.firebaseData.uid
      axios.get(`${url}/app/${fid}/getMyImages`)
        .then(res => {
          console.log(res)
          this.myImages = res.data.myImages
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created(){
    const check = this.store.firebaseData.hasOwnProperty('uid')
    if(check === true){
      this.getUserImages()
    }
  },
  watch:{
    newAddedImages:{
      handler(newVal){
        if(newVal){
          const check = newVal.length > 0 ? true : false
          const newOption = {id:3,label:'Add New Selected Images',icon:'edit',color:'blue-4'}
          if(check){
            const seccheck = this.options.some(
              object => object.id === newOption.id
            )
            if(!seccheck){
              this.options.push(newOption)
            }
          }else{
            const thirdCheck = this.options.some(
              object => object.id === newOption.id
            )
            if(thirdCheck){
              this.options = this.options.filter(
                object => object.id !== newOption.id
              )
            }
          }
        }
      },
      immediate:true, deep:true
    },
    //{id:1,label:'Delete Selecteds',icon:'delete_forever',color:'red-4'}
    selectedImages:{
      handler(newVal){
        if(newVal){
          const check = newVal.length > 0 ? true : false
          if(check){
            const secCheck = this.options.some(
              object => object.id === 1
            )
            if(!secCheck){
              this.options.push({id:1,label:'Delete Selecteds',icon:'delete_forever',color:'red-4'})
            }
          }else{
            this.options = this.options.filter(
              object => object.id !== 1
            )
          }
        }
      },
      immediate:true, deep:true
    },
    'store.myData':{
      handler(newVal){
        if(newVal){
          console.log('malll')
        }
      },
      immediate:true, deep:true
    }
  }
}
</script>

<style>

</style>
