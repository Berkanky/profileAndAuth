<template>
  <q-card
    class="q-pa-sm"
      :style="{
        'width':this.store.mobileActive ? '100%' : '600px',
        'margin':this.store.mobileActive ? '0 auto' : '0% auto'
      }"
    >
    <q-card-section>
      <div class="text-h6  text-grey-7 text-weight-bold">
        Personal Informations
      </div>
    </q-card-section>
    <q-card-section>
      <q-input
        filled
        v-model="this.store.newData.name"
        color="grey-8"
        label="First Name"
      >
        <template v-slot:prepend>
          <q-icon name="person"></q-icon>
        </template>
      </q-input>
      <q-input
        class="q-mt-sm"
        filled
        v-model="this.store.newData.surName"
        color="grey-8"
        label="Last Name"
      >
        <template v-slot:prepend>
          <q-icon name="person"></q-icon>
        </template>
      </q-input>
      <q-select
        filled
        class="q-mt-sm"
        label="Gender"
        v-model="this.gender"
        color="grey-8"
        @update:model-value="updateGender"
        :options="this.genderOption"

      >
        <template v-slot:prepend>
          <q-icon name="info"></q-icon>
        </template>
      </q-select>
      <q-card-section horizontal>
        <q-select
          v-model="this.store.newData.dialCode"
          label="Country"
          :options="this.onlyDialCodes"
          color="grey-8"
          filled
          class="q-mt-sm col-4"
          use-input
          @filter="filterForSelectDialCode"
        >
          <template v-slot:prepend>
            <q-icon name="info"></q-icon>
          </template>
        </q-select>
        <q-input
          class="q-mt-sm col q-ml-xs"
          filled
          v-model="this.store.newData.phoneNumber"
          label="Phone"
          mask="(###) ### - ####"
          fill-mask
          color="grey-8"
        />
      </q-card-section>
      <q-input
        color="grey-8"
        class="q-mt-sm"
        type="textarea" filled v-model="this.store.newData.userDescription"
        label="User Description"
        >
          <template v-slot:prepend>
            <q-icon name="info"></q-icon>
          </template>
        </q-input>
    <q-card-section horizontal class="q-mt-sm">
      <q-date
        style="border-radius:7px;"
        class="col"
        v-model="this.birthdayDate.birthdayDate"  dark mask="YYYY-MM-DD" color="orange-4" />
      <q-time
        style="border-radius:7px;"
        class="col q-ml-xs"
        v-model="this.birthdayDate.birthdayHour" dark mask="HH:mm" color="orange-4" />
    </q-card-section>
<!--     <q-select
      filled
      label="Select Country"
      color="grey-8"
      class="q-mt-sm"
      v-model="this.locationAdressDetail.country"
      :options="this.onlyCountriesList"
      @filter="findCountry"
      use-input
    >
      <template v-slot:prepend>
        <q-icon name="location_on"></q-icon>
      </template>
    </q-select> -->
    </q-card-section>
    <q-card-section>
      <q-btn
        v-on:click="saveInformations"
        color="green-4" no-caps label="Save&Skip" class="full-width"></q-btn>
    </q-card-section>
    <q-card-section horizontal class="q-pa-md">
      <q-btn
        no-caps
        class="col"
        label="Back"
        v-on:click="this.store.currentStep = this.store.currentStep - 1"
        icon="arrow_left" flat color="grey-8"></q-btn>
      <q-btn
        v-on:click="skipCurrentStep"
        flat color="grey-8" no-caps label="Next" icon-right="arrow_right" class="col q-mt-sm"></q-btn>
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
      gender:'',
      genderOption:[
        {id:1,label:'Male'},
        {id:2,label:'Female'},
        {id:3,label:'Secret'}
      ],
      onlyDialCodes:[],
      locationAdressDetail:{},
      birthdayDate:{
        birthdayDate:'',
        birthdayHour:'',
        birthDayVal:''
      },
      onlyCountriesList:[],
    }
  },
  methods:{
    getUserBirthdayDate(){

    },
    getPersonalDetails(){
      this.$watch('store.myData',(newVal) => {
        if(newVal){
          Object.assign(this.store.newData,newVal)

          const check = newVal.hasOwnProperty('birthdayDate')
          if(check){
            Object.assign(this.birthdayDate,newVal.birthdayDate)
          }

        }
      },{
        immediate:true, deep:true
      })
    },
    updateGender(val){
      if(val){
        Object.assign(this.store.newData,{
          gender:val.label
        })
      }
    },
    saveInformations(){
      console.log(this.store.newData)
      ///:firebaseId/uploadProfileStepper
      const allBody = {
        newData:this.store.newData
      }
      axios.put(`${this.store.baseUrl}/app/${this.store.firebaseData.uid}/uploadProfileStepper`, allBody)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    skipCurrentStep(){
      this.store.currentStep = this.store.currentStep + 1
    },
    findCountry(val,update){
      update(() => {
        if(val){
          const result = this.onlyCountriesList.filter(
            object => (object.toLowerCase()).includes(val.toLowerCase())
          )
          if(result){
            this.onlyCountriesList = result
          }
        }else{
          this.getAllDialCodes()
        }
      })
    },
    getAllDialCodes(){
      const url = this.store.baseUrl
      const id = this.store.firebaseData.uid
      axios.get(`${url}/app/${id}/getAllDialCodes`)
        .then(res => {
          console.log(res)
          this.onlyDialCodes = res.data.onlyDialCodeList
          this.onlyCountriesList = res.data.onlyCountriesList
        })
        .catch(err => {
          console.log(err)
        })
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
  },
  created(){
    this.getPersonalDetails()
  },
  watch:{
    'store.newData':{
      handler(newVal){
        if(newVal){
          console.log(newVal)
        }
      },
      immediate:true, deep:true
    },
    locationAdressDetail:{
      handler(newVal){
        if(newVal){
          const check = ['country'].every((key) => key in this.locationAdressDetail)
          if(check){
            Object.assign(this.store.newData,{
              locationAdressDetail:this.locationAdressDetail
            })
          }
        }
      },
      immediate:true, deep:true
    },
    birthdayDate:{
      handler(newVal){
        if(newVal){
          const check = ['birthdayDate','birthdayHour'].every((key) => key in this.birthdayDate)
          if(check){
            Object.assign(this.store.newData,{
              birthdayDate:newVal,
              birthDayVal:String(newVal.birthdayDate ?? '') + ' ' +String(newVal.birthdayHour ?? '')
            })
          }
        }
      },
      immediate:true, deep:true
    },
    'store.firebaseData':{
      handler(newVal){
        if(newVal){
          const check = 'uid' in newVal
          if(check){
            const id = newVal.uid
            this.getAllDialCodes()
          }
        }
      },
      immediate:true ,deep:true
    }
  }
}
</script>

<style>

</style>
