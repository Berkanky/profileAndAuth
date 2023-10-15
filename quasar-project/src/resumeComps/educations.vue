<template>
  <q-card
    class="q-pa-sm"
        :style="{
          'width':this.store.mobileActive ? '100%' : '600px',
          'margin':this.store.mobileActive ? '0 auto' : '0% auto'
        }"
      >
    <q-card-section>
      <div class="text-subtitle2 text-weight-bold text-grey-8">
        Education Informations
      </div>
    </q-card-section>
    <q-card-section>
      <q-scroll-area
        :style="{
          'height':this.store.mobileActive ? ''  : (this.$q.screen.height)/1.64 + 'px',
          'width':this.store.mobileActive ? '100%' : '100%'
        }"
      >
      <q-card
        bordered
        v-for="(data,key) in this.myEducations" :key="key"
        style="border-radius:4px;;"
        class="q-mt-xs text-capitalize"
      >
        <q-item>
          <q-item-section class="col">
            <div class="text-caption text-grey-5">
              {{ data.educationDegreeType }}
              <q-btn icon="fiber_manual_record" flat size="sm" :color="data.educationStatus === true ? 'green-4' : 'grey'"></q-btn>
            </div>
            <div class="text-subtitle2 text-weight-bold text-grey-7">
              {{ data.educationLocationName }}
            </div>
            <div class="text-overline text-grey-7">
              {{ data.educationDepartmentName }}
            </div>
            <div class="text-caption text-grey-5 text-weight-bold">
              {{ data.educationStartDate ?? '' }} - {{ data.educationFinishDate ?? '' }}
            </div>
          </q-item-section>
          <q-item-section class="col-2 text-right justify-around" vertical>
            <q-btn icon="edit" flat color="grey-8" v-on:click="editEducationBtn(data)"></q-btn>
            <q-btn icon="delete_forever" flat color="red-4" v-on:click="deleteForever(data)"></q-btn>
          </q-item-section>
        </q-item>
      </q-card>
    </q-scroll-area>
    </q-card-section>
    <q-btn
        v-on:click="addEducation"
        icon="add" flat color="green-4" no-caps label="Add Education" class="full-width"></q-btn>
      <q-btn
        v-on:click="saveAndSkip"
        icon="" label="Save&Skip" no-caps color="green-4" class="full-width q-mt-md"
      ></q-btn>
    <q-card-section horizontal class="q-pa-md">
      <q-btn
        v-on:click="this.store.currentStep = this.store.currentStep - 1"
        class="col" flat color="grey-8" label="Back" no-caps
        icon="arrow_left"></q-btn>
      <q-btn
        v-on:click="this.store.currentStep = this.store.currentStep + 1"
        icon-right="arrow_right" flat color="grey-8" label="Next" no-caps class="col"></q-btn>
    </q-card-section>
  </q-card>
</template>

<script>
import axios from 'axios'
import {useCounterStore} from '../stores/store'
import addEducationVue from './addEducation.vue'
export default {
  components:{
    addEducationVue
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      myEducations:[]
    }
  },
  methods:{
    editEducationBtn(data){
      this.store.selectedEducationForEdit = data
      this.store.addNewEducationCardActive = true
      this.store.educationEditActive = true
    },
    deleteForever(data){
      this.$q.dialog({
        title:'Warning',
        color:'teal',
        message:'Emin misin ?',
        cancel:true,
        fullHeight:this.store.mobileActive ? true : false,
        maximized:this.store.mobileActive ? true : false
      }).onOk(() => {
        console.log(data)
        ///:firebaseId/:educationId/removeEducation
        const url = this.store.baseUrl
        const firebaseId = this.store.firebaseData.uid
        const educationId = data._id
        axios.put(`${url}/app/${firebaseId}/${educationId}/removeEducation`)
          .then(res => {
            console.log(res)
            this.myEducations = this.myEducations.filter(
              object => object._id !== data._id
            )
          })
          .catch(err => {
            console.log(err)
          })

      })
    },
    addEducation(){
      this.store.addNewEducationCardActive =! this.store.addNewEducationCardActive
    },
    saveAndSkip(){
      this.store.currentStep = this.store.currentStep + 1
    },
    catchMyEducations(){
      const checkId = '_id' in this.store.myData
      if(checkId){
        const check = this.store.myData.hasOwnProperty('educations')
          if(check){
            const length = this.store.myData.educations.length
            if(length > 0){
              this.myEducations = this.store.myData.educations
            }
          }else{
            this.myEducations = []
          }
        }
    }
  },
  created(){
    this.catchMyEducations()
  },
  watch:{
    'store.myData':{
      handler(newVal){
        if(newVal){
          const check = '_id' in newVal
          if(check){
            //this.catchMyEducations()
          }
        }
      },
      immediate:true, deep:true
    }
  }
}
</script>

<style>

</style>
