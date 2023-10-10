<template>
  <q-card
  class="q-pa-sm"
        :style="{
          'width':this.store.mobileActive ? '100%' : '600px',
          'margin':this.store.mobileActive ? '0 auto' : '0% auto'
        }"
  >
  <q-card-section>
    <q-btn icon="keyboard_backspace" flat color="grey-8" v-on:click="this.store.addNewEducationCardActive =! this.store.addNewEducationCardActive"></q-btn>
  </q-card-section>
  <q-separator size="1.5px"></q-separator>
    <q-card-section>
      <q-select
        :options="this.degreeOptions"
        filled
        v-model="this.educationDegreeType"
        @update:model-value="selectDegreeType"
        label="Select Degree Type"
        color="grey-8"
      >
        <template v-slot:prepend>
          <q-icon name="info"></q-icon>
        </template>
      </q-select>
      <q-input
        v-model="this.educationSchema.educationLocationName"
        filled
        color="grey-8"
        class="q-mt-sm"
        label="University Name"
      >
        <template v-slot:prepend>
          <q-icon name="school"></q-icon>
        </template>
      </q-input>
      <q-input
        v-model="this.educationSchema.educationDepartmentName"
        filled
        color="grey-8"
        class="q-mt-sm"
        label="University Department"
      >
        <template v-slot:prepend>
          <q-icon name="school"></q-icon>
        </template>
      </q-input>
      <q-card-section class="q-mt-sm" horizontal>
        <q-date
          dark
          class="col-6"
          v-model="this.educationSchema.educationStartDate" mask="YYYY-MM-DD" color="orange-4" style="border-radius:7px;" />
        <q-date
          dark
          class="col-6 q-ml-xs"
          v-model="this.educationSchema.educationFinishDate" mask="YYYY-MM-DD" color="orange-4" style="border-radius:7px;" />
      </q-card-section>
      <div class="q-pa-sm">
        <q-checkbox
          label="Still Student"
          class="q-mt-sm" :color="this.educationSchema.educationStatus ? 'green-4' : 'red-4'"
          v-model="this.educationSchema.educationStatus" />
      </div>
      <q-card-section class="q-mt-sm">
        <q-btn
          v-if="!this.store.educationEditActive"
          icon="" color="green-4" class="full-width" label="Save&Skip" no-caps v-on:click="addNewEducation"></q-btn>
          <q-btn
          v-if="this.store.educationEditActive"
          icon="edit" color="green-4" class="full-width" label="Edit" no-caps v-on:click="editSelectedEducation"></q-btn>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script>
import axios from 'axios'
import {useCounterStore} from '../stores/store'
export default {
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      degreeOptions:[
        {id:1,label:'Other'},
        {id:2,label:'Associate Degree'},
        {id:3,label:'Bacheelor Degree'},
        {id:4,label:'Master'},
        {id:5,label:'Doctorate'}
      ],
      educationSchema:{
        educationStatus:false
      },
      educationDegreeType:''
    }
  },
  methods:{
    editSelectedEducation(){
      ///:firebaseId/:educationId/editEducation
      const allBody = {
        selectedEducationForEdit:this.store.selectedEducationForEdit
      }
      axios.put(`${this.store.baseUrl}/app/${this.store.firebaseData.uid}/${this.store.selectedEducationForEdit._id}/editEducation`,allBody)
        .then(res => {
          console.log(res)
          this.store.addNewEducationCardActive = false
          this.store.educationEditActive = false
          this.store.selectedEducationForEdit = {}
        })
        .catch(err => {
          console.log(err)
        })
    },
    selectDegreeType(val){
      if(val){
        Object.assign(this.educationSchema,{
          educationDegreeType:val.label
        })
      }
    },
    addNewEducation(){
      ///:firebaseId/addNewEduaction
      console.log(this.educationSchema)

      const allBody = {
        educationSchema:this.educationSchema
      }
      axios.put(`${this.store.baseUrl}/app/${this.store.firebaseData.uid}/addNewEduaction`, allBody)
        .then(res => {
          console.log(res)
          this.educationSchema = {
            educationStatus:false
          }
          this.educationDegreeType = ''

          Object.assign(this.store.myData,res.data.findme)

          this.store.addNewEducationCardActive =! this.store.addNewEducationCardActive
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created(){

  },
  watch:{
    educationSchema:{
      handler(newVal){
        if(newVal){
          const checkEditActive = this.store.educationEditActive === true ? true : false
          if(checkEditActive){
            Object.assign(this.store.selectedEducationForEdit,newVal)
            console.log(this.store.selectedEducationForEdit)
          }
        }
      },
      immediate:true, deep:true
    },
    'store.selectedEducationForEdit':{
      handler(newVal){
        if(newVal && this.store.educationEditActive === true){
          this.educationSchema = newVal
        }
      },
      immediate:true, deep:true
    }
  }
}
</script>

<style>

</style>
