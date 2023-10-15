<template>
  <q-card
    class="q-pa-sm"
    :style="{
      'width':this.store.mobileActive ? '100%' : '600px',
      'margin':this.store.mobileActive ? '0 auto' : '0% auto',
      'height':this.$q.screen.height + 'px'
    }"
  >
    <q-card-section>
      <div class="text-h6 text-weight-bold text-grey-7">
        We know you don't like filling out your CV information...
      </div>
      <div class="text-weight-bold text-grey-6">
        Thanks to our artificial intelligence-supported robot, we fill out the profiles automatically. Upload your current CV in the appropriate format and apply to free events and postings!
      </div>  
    </q-card-section>
    <q-card-section v-if="this.checkMyCvInDb() === true">
      <q-card
        style="border-radius:4px;"
      >
        <q-item class="">

          <q-item-section avatar>
            <q-icon name="folder" color="grey-8" flat  class="col-2"></q-icon>
          </q-item-section>
          <q-item-section class="col" >
            <div class=" text-overline text-grey-8 text-weight-bold">
              {{ this.store.myData.selectedCvFile.selectedCvFileName ?? 'No Cv Selected !' }}
            </div>
            <div class="text-caption text-blue-5 text-weight-bold">
              {{ this.store.myData.selectedCvFile.selectedCvFileUrl ? (this.store.myData.selectedCvFile.selectedCvFileUrl).slice(0,30)  :  'No CV URL' }}
            </div>
          </q-item-section>
          <q-item-section class="col-2">
            <q-btn icon="delete_forever" v-on:click="removeCv" flat color="red-4"></q-btn>
            <q-btn icon="download" flat color="green-4" v-on:click="downloadFile"></q-btn>
          </q-item-section>
        </q-item>
      </q-card>
    </q-card-section>
    <q-card-section>

      <q-file
        class=""
        v-model="this.selectFile"
        label="Pick Resume CV"
        filled
        counter
        @update:model-value="selectFileFunction"
        color="grey-8"
      >
        <template v-slot:prepend>
          <q-icon name="folder"></q-icon>
        </template>
        <template v-slot:append>
          <q-btn
            v-if="this.selectFile"
            icon="remove" flat color="red-4" size="xs" v-on:click="clearSelectedImage"></q-btn>
          </template>
      </q-file>
    </q-card-section>
    <q-card-section>
      <q-btn
        :disable="this.checkResume() ? false : true"
        color="grey-6" class="full-width" no-caps label="Upload" v-on:click="uploadResume"></q-btn>
    </q-card-section>
    <q-card-section
      class="absolute-bottom"
    >
      <q-btn
        class="full-width"
        icon="" flat color="grey-8" label="Next" no-caps icon-right="arrow_right" v-on:click="skipStep"></q-btn>
    </q-card-section>
  </q-card>
</template>

<script>
import {useCounterStore} from '../stores/store'
import axios from 'axios'
export default {
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      selectFile:'',
    }
  },
  methods:{
    downloadFile(){
      const myFile = this.store.myData.selectedCvFile
      var link = document.createElement("a");
      // If you don't know the name or want to use
      // the webserver default set name = ''
      link.setAttribute('download', myFile.selectedCvFileName);
      link.href = myFile.selectedCvFileUrl;
      document.body.appendChild(link);
      link.click();
    },
    skipStep(){
      this.store.currentStep = this.store.currentStep + 1
    },
    removeCv(){
      ///:firebaseId/removeCv
      axios.put(`${this.store.baseUrl}/app/${this.store.firebaseData.uid}/removeCv`)
        .then(res => {
          console.log(res)

          delete this.store.myData.selectedCvFile

        })
        .catch(err => {
          console.log(err)
        })
    },
    checkMyCvInDb(){
      // Check if the user has a selected CV file in the database.

      const check = this.store.myData.hasOwnProperty('selectedCvFile')

      // If the user has a selected CV file in the database,
      // check if the CV file has a URL.

      if(check === true){
        const checkUrl = this.store.myData.selectedCvFile.hasOwnProperty('selectedCvFileUrl')

        // If the CV file has a URL, check if the URL is not empty or null.

        if(checkUrl){
          const thirdCheck = this.store.myData.selectedCvFile.selectedCvFileUrl !== '' && this.store.myData.selectedCvFile.selectedCvFileUrl !== null ? true : false

          // If the URL is not empty or null, return true, otherwise return false.

          return thirdCheck
        }else{
          return false
        }
      }else{
        return false
      }
    },
    checkResume(){
      const check = this.store.newData.hasOwnProperty('selectedCvFile')
      if(check){
        return true
      }else{
        return false
      }
    },
    uploadResume(){
      ///:firebaseId/uploadProfileStepper
      const allBody = {
        newData:this.store.newData
      }

      axios.put(`${this.store.baseUrl}/app/${this.store.firebaseData.uid}/uploadProfileStepper`, allBody)
        .then(res => {
          console.log(res)

          Object.assign(this.store.myData,{
            selectedCvFile:res.data.selectedCvFile
          })
          console.log('myData',this.store.myData)
        })
        .catch(err => {
          console.log(err)
        })

    },
    clearSelectedImage(){
      this.store.selectedCv = {}
      this.selectFile = ''
      const check = this.store.newData.hasOwnProperty('selectedCvFile')
      if(check){
        delete this.store.newData.selectedCvFile
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
              Object.assign(newObject,{
                url : reader.result
              })

              const fileNewObjSchema = {
                selectedCvFileUrl:newObject.url,
                selectedCvFileName:newObject.name,
                selectedCvFileType:newObject.type
              }

              Object.assign(this.store.selectedCv,newObject)

              Object.assign(this.store.newData,{
                selectedCvFile:fileNewObjSchema
              })

              console.log('selectedCv',this.store.selectedCv)
              console.log('newData',this.store.newData)
        };
        reader.readAsDataURL(val);
      }
    },
  },
  created(){

  },
  watch:{

  }
}
</script>

<style>

</style>
