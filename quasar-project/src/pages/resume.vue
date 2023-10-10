<style>
::-webkit-scrollbar {
  display: none;
  width: 0;  /* Remove scrollbar space */
  background: transparent;  /* Optional: just make scrollbar invisible */
}
/* Optional: show position indicator in red */
::-webkit-scrollbar-thumb {
  background: #FF0000;
}
</style>

<template>
  <q-page class="resumePage row">
    <stepperCompVue/>
    <div
      class="col"
    >
      <selectResumeVue v-if="this.store.currentStep === 1"/>
      <personalInformationVue v-if="this.store.currentStep === 2"/>
      <educationVue v-if="this.store.currentStep === 3 && !this.store.addNewEducationCardActive"/>
      <addEducationVue v-if="this.store.currentStep === 3 &&  this.store.addNewEducationCardActive"/>
      <workExperienceVue v-if="this.store.currentStep === 4 && !this.store.addWorkExperienceCardActive"/>
      <addWorkExperienceVue v-if="this.store.currentStep  === 4 && this.store.addWorkExperienceCardActive"/>
      <socialMediaLinksVue v-if="this.store.currentStep === 5"/>
      <mySkills v-if="this.store.currentStep === 6"/>
      <myLocationDetails v-if="this.store.currentStep === 7"/>
      <searchingPositions v-if="this.store.currentStep === 8"/>
      <userImages v-if="this.store.currentStep === 9"/>
      <endResume v-if="this.store.currentStep === 10"/>
    </div>
  </q-page>
</template>

<script>
import userImages from 'src/resumeComps/userImages.vue'
import endResume from 'src/resumeComps/endResume.vue'
import searchingPositions from 'src/resumeComps/searchingPositions.vue'
import myLocationDetails from 'src/resumeComps/myLocationDetails.vue'
import mySkills from 'src/resumeComps/mySkills.vue'
import socialMediaLinksVue from '../resumeComps/socialMediaLinks.vue'
import addEducationVue from '../resumeComps/addEducation.vue'
import educationVue from '../resumeComps/educations.vue'
import {useCounterStore} from '../stores/store'
import stepperCompVue from 'src/resumeComps/stepperComp.vue'
import selectResumeVue from 'src/resumeComps/selectResume.vue'
import personalInformationVue from 'src/resumeComps/personalInformation.vue'
import workExperienceVue from 'src/resumeComps/workExperience.vue'
import addWorkExperienceVue from 'src/resumeComps/addWorkExperience.vue'
export default {
  components:{
    mySkills,
    stepperCompVue,
    selectResumeVue,
    personalInformationVue,
    educationVue,
    addEducationVue,
    workExperienceVue,
    addWorkExperienceVue,
    socialMediaLinksVue,
    myLocationDetails,
    searchingPositions,
    endResume,
    userImages
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{

    }
  },
  methods:{

  },
  created(){
  },
  watch:{
    'store.currentStep':{
      handler(newVal){
        if(newVal){
          const firebaseId = this.store.firebaseData.uid
          this.store.getUserDetailFromDB(firebaseId)
        }
      },
      immediate:true, deep:true
    }
  }
}
</script>
