<template>
  <q-dialog
    v-model="this.store.cameraDialogActive"
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
    persistent
    :position="this.store.mobileActive ? 'center' : 'right'"
  >
  <q-card
    class="bg-grey-2"
    :style="{
      'width':this.store.mobileActive ? '100%' : '600px',
      'max-width':this.store.mobileActive ? '100%' : '600px',
      'border-radius':this.store.mobileActive ? '0px' : '15px'
    }"
  >
    <q-card-section>
      <q-btn icon="keyboard_backspace" flat color="grey-8" v-on:click="goBack"></q-btn>
    </q-card-section>
    <q-separator size="1.5px"></q-separator>
    <q-btn
        v-if="!this.isCameraOpen"
        class="full-width"
        icon="camera" label="Open Camera" no-caps color="green-4"
         v-on:click="openCamera"></q-btn>
      <q-btn
        class="full-width"
        icon="cancel" color="red-4" no-caps
        v-on:click="openCamera" v-else label="Close Camera"></q-btn>

    <q-card-section class="text-center">
      <div
        style=""
        v-if="isCameraOpen" v-show="!isLoading" class="camera-box" :class="{ 'flash' : isShotPhoto }">

        <div
          class="camera-shutter" :class="{'flash' : isShotPhoto}"></div>

        <video
          style=""
          v-show="!isPhotoTaken" ref="camera" :height="337.5" autoplay></video>
        <canvas
          v-show="isPhotoTaken" id="photoTaken" ref="canvas"
          :width="450"
          :height="337.5"></canvas>
      </div>
      <div v-if="!this.isCameraOpen" class="text-center q-pa-md">
        <q-spinner-cube
          color="green-4"
          size="8.5em"
        />
      </div>
      <div v-if="isCameraOpen && !isLoading" class="text-center">
        <q-btn icon="camera" color="grey-7" push class="q-pa-md" size="md" v-on:Click="takePhoto"></q-btn>
        <q-btn
          id="downloadPhoto" download="my-photo.jpg" push
          v-if="this.isPhotoTaken && this.isCameraOpen" color="grey-7" icon="upload"
          class="q-pa-md q-ml-xs" size="md"
          v-on:click="downloadImage"
        ></q-btn>
      </div>
    </q-card-section>

    <q-card-section class="row">
      <q-card
        style="height:150px;"
        flat
        class="col-12 col-md-4 col-sm-4 q-mt-xs q-pa-xs"
        v-for="(data,key) in this.myImageList" :key="key"
      >
        <q-img
          class=""
          style="object-fit:Cover;height:100%;"
          :src="data.url"
        >
          <div class="absolute-center bg-transparent">
            <q-btn
              v-on:click="removeImage(data)"
              icon="cancel" flat color="white"></q-btn>
          </div>
        </q-img>
      </q-card>
      <q-card
        v-if="this.myImageList.length"
        style="height:150px;"
        class="col-12 col-md-4 col-sm-4 bg-grey-8 q-ml-xs q-mt-xs"
      >
      <q-btn
        v-on:click="addSelectedImages"
        icon="add" color="green-4" flat class="full-width full-height"></q-btn>
      </q-card>
    </q-card-section>
  </q-card>
  </q-dialog>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
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
      isCameraOpen: false,
      isPhotoTaken: false,
      isShotPhoto: false,
      isLoading: false,
      link: '#',
      myImageList:[]
    }
  },
  methods:{
    addSelectedImages(){
      this.myImageList.forEach(element => {
        const newObject = {
          imageUrl:element.url,
          imageId:''
        }
        const result = this.myImageList.find(
          object => object.url === element.url
        )
        if(result){
          Object.assign(result,newObject)
        }

      });
      const allBody = {
        myImageList:this.myImageList
      }
      ///:firebaseId/addSelectedImages
      const id = this.store.firebaseData.uid
      axios.put(`${this.store.baseUrl}/app/${id}/addSelectedImages`, allBody)
        .then(res => {
          console.log(res)
          this.myImageList = []
          const imageAddedActive = true
          this.$emit('imageAddedActive',imageAddedActive)
        })
        .catch(err => {
          console.log(err)
        })
      console.log(allBody)
    },
    removeImage(data){
      this.myImageList = this.myImageList.filter(
        object => object.imageId !== data.imageId
      )
    },
    createCameraElement() {
      this.isLoading = true;
      const constraints = (window.constraints = {
				audio: false,
				video: true
			});
			navigator.mediaDevices
				.getUserMedia(constraints)
				.then(stream => {
          console.log(stream)
          this.isLoading = false;
					this.$refs.camera.srcObject = stream;
				})
				.catch(error => {
          this.isLoading = false;
					alert("May the browser didn't support or there is some errors.");
				});
    },
    stopCameraStream() {
      let tracks = this.$refs.camera.srcObject.getTracks();
			tracks.forEach(track => {
				track.stop();
			});
    },
    closeAll(){
      this.isCameraOpen = false
      this.isPhotoTaken = false
      this.isShotPhoto = false
      this.stopCameraStream()
    },
    openCamera(){
      if(this.isCameraOpen){
        this.closeAll()
        this.stopCameraStream()
      }else{
        this.isCameraOpen = true
        this.createCameraElement()
      }
    },
    goBack(){
      this.store.cameraDialogActive =! this.store.cameraDialogActive
    },
    takePhoto() {
      if(!this.isPhotoTaken) {
        this.isShotPhoto = true;

        const FLASH_TIMEOUT = 50;

        setTimeout(() => {
          this.isShotPhoto = false;
        }, FLASH_TIMEOUT);
      }

      this.isPhotoTaken = !this.isPhotoTaken;

      const context = this.$refs.canvas.getContext('2d');
      context.drawImage(this.$refs.camera, 0, 0, 450, 337.5);

      const imageData =  {}
      const canvas = document.getElementById('photoTaken').toDataURL("image/jpeg")
      //console.log(canvas)
      Object.assign(imageData,{
        imageId:uuidv4(),
        url:canvas
      })
      this.myImageList.push(imageData)
      console.log(imageData)
    },
    updateImage(imageData){
      const allBody ={
        imageData:imageData
      }

      const id = this.store.firebaseData.uid
      const url = this.store.baseUrl

      axios.put(`${url}/app/${id}/updateProfilePic`, allBody)
        .then(res => {
          console.log(res)
          Object.assign(this.store.myData,res.data.findme)
          const updateActive = {active:true}
          this.$emit('updateActive',updateActive)
        })
        .catch(err => {
          console.log(err)
        })

    },
    downloadImage() {
      this.$q.dialog({
        dark:true,
        cancel:true,
        title:'Warning',
        message:'Are Sure For Update Profile Pic ? ',
        fullHeight:this.store.mobileActive ? '100%' : '400px',
        maximized:this.store.mobileActive ? '100%' : '400px'
      }).onOk(() => {
        const imageData =  {}
        const download = document.getElementById('downloadPhoto')
        const canvas = document.getElementById('photoTaken').toDataURL("image/jpeg")
        //console.log(canvas)
        Object.assign(imageData,{
          url:canvas
        })
        console.log(imageData)
        this.updateImage(imageData)
      }).onCancel(() => {
        //
      })
    },
  },
  created(){
    this.isCameraOpen = true
    this.createCameraElement()
    const video = document.querySelector('video');
    if(video){
      console.log('video.hasAttribute',video.hasAttribute('border-radius')); // true veya false döndürür
    }
  },
  watch:{

  }
}
</script>

<style>
.camera-box video{
  border-radius: 15px !important;
}

.camera-box canvas{
  border-radius: 15px !important;
}
</style>
