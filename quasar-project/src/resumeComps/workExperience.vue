<template>
  <q-card
  class="q-pa-sm"
      :style="{
        'width':this.store.mobileActive ? '100%' : '600px',
        'margin':this.store.mobileActive ? '0 auto' : '0% auto'
      }"
  >
        <q-input
          class="q-mt-md"
          type="number"
          filled
          label="Work Experience"
          color="grey-8"
          v-model="this.workExperienceVal"
        ></q-input>
      <q-card-section>
        <q-scroll-area
          :style="{
            'height':this.store.mobileActive ? ''  : (this.$q.screen.height)/1.64 + 'px',
            'width':this.store.mobileActive ? '100%' : '100%'
          }"
        >
          <q-card
            bordered
            style="border-radius:4px;"
            class="q-mt-xs text-capitalize"
            v-for="(data,key) in this.workExperiences" :key="key"
          >
            <q-item>
              <q-item-section avatar>
                <q-icon name="info" color="grey-8"></q-icon>
              </q-item-section>
              <q-item-section class="">
                <div class="text-subtitle2 text-weight-bold text-grey-8">
                  {{ data.workCompanyName ?? '' }}
                  <q-btn icon="fiber_manual_record" flat :color="data.workStatus ? 'green-4' : 'red-4'" size="sm">
                    <q-tooltip>
                      {{ data.workStatus ? 'Still Working' : 'Not Working' }}
                    </q-tooltip>
                  </q-btn>
                </div>
                <div class="text-caption text-grey-6 text-weight-bold">
                  {{ data.workPosition ?? '' }}
                </div>
                <div class="text-caption text-grey-6 text-weight-bold" >
                  <span>
                    {{ data.workStartDate ?? '' }}
                  </span>
                  <span v-if="data.workStatus === false">
                    {{ data.workStatus === false ? data.workFinishDate : ''}}
                  </span>
                </div>
              </q-item-section>
              <q-item-section class="text-right col-2" vertical>
                <q-btn icon="edit" flat color="grey-8" v-on:click="editWork(data)"></q-btn>
                <q-btn icon="delete_forever" flat color="red-4" v-on:click="removeWorkExperience(data)"></q-btn>
              </q-item-section>
            </q-item>
          </q-card>
        </q-scroll-area>
      </q-card-section>
      <q-btn
          no-caps
          v-on:click="this.store.addWorkExperienceCardActive =! this.store.addWorkExperienceCardActive"
          icon="add" flat color="green-4" label="Add Work Experience" class="full-width"></q-btn>
        <q-btn icon="" no-caps label="Save&Skip" color="green-4" class="full-width q-mt-md" v-on:click="saveExperience"></q-btn>
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
export default {
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      workExperienceVal:0,
      workExperiences:[]
    }
  },
  methods:{

    checkMyDataWorkExperience(){
      const check = this.store.myData.hasOwnProperty('totalWorkExperience')
      if(check){
        this.workExperienceVal = this.store.myData.totalWorkExperience
      }else{
        this.workExperienceVal = 0
      }

    },
    saveExperience(){
      console.log(this.workExperienceVal)

      if(this.workExperienceVal){
        this.store.newData.totalWorkExperience = Number(this.workExperienceVal)
        ///:firebaseId/uploadProfileStepper
        const url = this.store.baseUrl
        const id = this.store.firebaseData.uid
        console.log(this.store.newData)
        const allBody = {
          newData:this.store.newData
        }

        axios.put(`${url}/app/${id}/uploadProfileStepper`, allBody)
          .then(res => {
            console.log(res)
            //this.workExperienceVal = res.data.findme.totalWorkExperience ?? 0
            Object.assign(this.store.myData,res.data.findme)
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    editWork(data){
      this.store.selectedWorkForEdit = data
      this.store.addWorkExperienceCardActive = true
      this.store.workEditActive = true
    },
    removeWorkExperience(data){
      const url = this.store.baseUrl
      const firebaseId = this.store.firebaseData.uid
      const workExperienceId = data._id
      ///:firebaseId/:workExperienceId/removeWorkExperience
      axios.put(`${url}/app/${firebaseId}/${workExperienceId}/removeWorkExperience`)
        .then(res => {
          console.log(res)
          this.workExperiences = this.workExperiences.filter(
            object => object._id !== data._id
          )

          Object.assign(this.store.myData,res.data.findme)

        })
        .catch(err => {
          console.log(err)
        })
    },
    getMyExperiences(){
      const check = this.store.myData.hasOwnProperty('_id')
      if(check === true){
        const secCheck = this.store.myData.hasOwnProperty('works')
        if(secCheck){
          this.workExperiences = this.store.myData.works
        }else{
          this.workExperiences = []
        }
      }else{
        this.workExperiences = []
      }
    }
  },
  created(){
    this.checkMyDataWorkExperience()
    this.getMyExperiences()
  },
  watch:{

  }
}
</script>

<style>

</style>
