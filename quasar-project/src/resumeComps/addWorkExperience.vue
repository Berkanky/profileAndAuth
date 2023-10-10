<template>
  <q-card
  class="q-pa-sm"
      :style="{
        'width':this.store.mobileActive ? '100%' : '600px',
        'margin':this.store.mobileActive ? '0 auto' : '0% auto'
      }"
  >
    <q-card-section>
      <q-btn icon="keyboard_backspace" flat color="dark" v-on:click="goBack"></q-btn>
    </q-card-section>
    <q-separator size="1.5px"></q-separator>
    <q-card-section>
      <q-input
        v-model="this.workExperienceSchema.workCompanyName"
        color="grey-8"
        filled
        class=""
        label="Company Name"
      >
        <template v-slot:prepend>
          <q-icon name="work"></q-icon>
        </template>
      </q-input>
      <q-input
        v-model="this.workExperienceSchema.workPosition"
        color="grey-8"
        filled
        class="q-mt-sm"
        label="Position"
      >
        <template v-slot:prepend>
          <q-icon name="work"></q-icon>
        </template>
      </q-input>
      <q-input
        v-model="this.workExperienceSchema.workDepartmentName"
        color="grey-8"
        filled
        class="q-mt-sm"
        label="Department Name"
      >
        <template v-slot:prepend>
          <q-icon name="work"></q-icon>
        </template>
      </q-input>
      <q-card-section class="q-mt-sm" horizontal>
        <q-date
          dark
          class="col-6"
          v-model="this.workExperienceSchema.workStartDate" mask="YYYY-MM-DD" color="orange-4" style="border-radius:7px;" />
        <q-date
          dark
          class="col-6 q-ml-xs"
          v-model="this.workExperienceSchema.workFinishDate" mask="YYYY-MM-DD" color="orange-4" style="border-radius:7px;" />
      </q-card-section>
      <div class="q-pa-sm">
        <q-checkbox
          label="Still Work"
          class="q-mt-sm" :color="this.workExperienceSchema.workStatus ? 'green-4' : 'red-4'"
          v-model="this.workExperienceSchema.workStatus" />
      </div>
    </q-card-section>
    <q-card-section class="q-mt-sm">
        <q-btn
          v-if="!this.store.workEditActive"
          icon="" color="green-4" class="full-width" label="Save&Skip" no-caps v-on:click="addNewWorkExperience"></q-btn>
          <q-btn
          v-if="this.store.workEditActive"
          icon="edit" color="green-4" class="full-width" label="Edit" no-caps v-on:click="editSelectedEducation"></q-btn>
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
      workExperienceSchema:{
        workStatus:false
      }
    }
  },
  methods:{
    goBack(){
      this.store.addWorkExperienceCardActive =! this.store.addWorkExperienceCardActive
      this.store.workEditActive = false
    },
    addNewWorkExperience(){
      console.log(this.workExperienceSchema)
      const allBody = {
        workExperienceSchema:this.workExperienceSchema
      }
      ///:firebaseId/addNewWorkExperience

      axios.put(`${this.store.baseUrl}/app/${this.store.firebaseData.uid}/addNewWorkExperience`, allBody)
        .then(res => {
          console.log(res)
          Object.assign(this.store.myData,res.data.findme)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    editSelectedEducation(){
      const allBody = {
        selectedWorkForEdit:this.store.selectedWorkForEdit
      }
      ///:firebaseId/:workExperienceId/updateWorkExperience
      axios.put(`${this.store.baseUrl}/app/${this.store.firebaseData.uid}/${this.store.selectedWorkForEdit._id}/updateWorkExperience`, allBody)
        .then(res => {
          console.log(res)
          Object.assign(this.store.myData,res.data.findme)
          this.store.selectedWorkForEdit = {}
          this.store.workEditActive = false
          this.store.addWorkExperienceCardActive = false
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created(){
    if(!this.store.workEditActive){
      this.workExperienceSchema = {
        workStatus:false
      }
    }
  },
  watch:{
    workExperienceSchema:{
      handler(newVal){
        if(newVal && this.store.workEditActive === true){
          Object.assign(this.store.selectedWorkForEdit,newVal)
          console.log(newVal)
        }
      },
      immediate:true, deep:true
    },
    'store.selectedWorkForEdit':{
      handler(newVal){
        if(newVal){
          Object.assign(this.workExperienceSchema,newVal)
        }
      },
      immediate:true, deep:true
    }
  }
}
</script>

<style>

</style>
