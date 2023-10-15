import { defineStore } from 'pinia';
import axios from 'axios'
export const useCounterStore = defineStore('counter', {
  state: () => ({
    defaultPhoto:'https://img.freepik.com/premium-vector/avatar-profile-icon-vector-illustration_276184-165.jpg',
    baseUrl:'http://localhost:3000',
    myData:{},
    myNotifies:{},
    pexelsApiKey:'563492ad6f917000010000018990b39d61f845559dab3acb2c9dd16d',
    openCageApiKey:'a7ac3cc8ba514f0287f82a6a306eabc8',
    firebaseData:{},
    mobileActive:false,
    window:{},
    loginPageCurrentOption:{
      signActive:true
    },
    selectedProfileImageDetail:{},
    //findedUseres
    findedUsers:[],
    friendsList:[],
    cameraDialogActive:false,

    //for update
    newData:{},
    currentStep:1,
    selectedCv:{},
    addNewEducationCardActive:false,
    addWorkExperienceCardActive:false,
    educationEditActive:false,
    selectedEducationForEdit:{},
    workEditActive:false,
    selectedWorkForEdit:{},
    addSocialMediaLinksDialogActive:false,
    editSocialMediaLinkActive:false,
    selectedSocialMediaLink:{},
    checkStatusResult:null,
    zoomImageActive:false,
    selectedImage:{
      imageUrl:'',
    },
    advertiseDetail:{}
  }),
  getters: {
  },
  actions: {
    getAllActiveAdvertises(){
      ///:firebaseId/getAllAdvertises
      axios.get(`${this.baseUrl}/app/${this.firebaseData.uid}/getAllAdvertises`)
        .then(res => {
          console.log('getAllAdvertises',res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getAllOldAdvertises(){
      const fid = this.firebaseData.uid
      const url = this.baseUrl
      ///:firebaseId/getMyJobAdvertises
      axios.get(`${url}/app/${fid}/getMyJobAdvertises`)
        .then( res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getMyAdvertise(){
      const fid = this.firebaseData.uid
      const url = this.baseUrl
      ///:firebaseId/getMyAdvertise
      axios.get(`${url}/app/${fid}/getMyAdvertise`)
        .then(res => {
          console.log(res)
          this.advertiseDetail = res.data.findadvertise
          console.log('advertiseDetail',this.advertiseDetail)
        })
        .catch(err => {
          console.log(err)
        })
    },
    checkMyAdvertiseStatus(id){
      const url = this.baseUrl
      ///:firebaseId/getAllAdvertisers
      axios.get(`${url}/app/${id}/getAllAdvertisers`)
        .then(res => {
          console.log(res)
          this.checkStatusResult = res.data.checkStatusResult
          console.log('checkStatusResult',this.checkStatusResult)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getGlobalInfos(){
      const allBody = {}
      const url = this.baseUrl
      const fid = this.firebaseData.uid
      const uid = this.myData._id

      Object.assign(allBody,{
        url,fid,uid
      })
      return allBody
    },
    getMyFriendsList(id){
      const url = this.baseUrl
      ///:currentUserId/getMyFriends
      axios.get(`${url}/app/${id}/getMyFriends`)
        .then(res=>{
          console.log(res)
          this.friendsList = res.data.friendsList
        })
        .catch(err => {
          console.log(err)
        })
    },
    addFriendOrRemove(userData){
      const url = this.baseUrl
      const id = this.firebaseData.uid
      const selectedUserId = userData.userDetail._id
      axios.put(`${url}/app/${id}/${selectedUserId}/addOrRemoveFriend`)
        .then(res => {
          console.log(res)
          const findselectedUser = this.findedUsers.find(
            object => object.userDetail._id === selectedUserId
          )
          if(findselectedUser){
            console.log('findselectedUser',findselectedUser)
            findselectedUser.friendActive =! findselectedUser.friendActive

            const check = findselectedUser.friendActive === true ? true : false
            if(check){
              const checkin = this.friendsList.some(
                object => object.userDetail._id === selectedUserId
              )
              if(!checkin){
                this.friendsList.push(
                  {
                    userDetail : res.data.findselecteduser,
                    userNotifies:{},
                    friendActive:true
                  },
                )
              }
            }else{
              this.friendsList = this.friendsList.filter(
                object => object.userDetail._id !== selectedUserId
              )
            }

          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    checkAccStatus(){
      const check = 'uid' in this.firebaseData
      return check
    },
    checkCurrentDevice(){
      if (window.innerWidth < 768) {
        this.mobileActive = true
      } else {
        this.mobileActive = false
      }
    },
    getUserDetailFromDB(firebaseId){
      axios.get(`${this.baseUrl}/app/${firebaseId}/getUserDetail`)
        .then(res => {
          console.log(res)
          this.myData = res.data.resBody.findme
          this.myNotifies = res.data.resBody.mynotifies
          console.log('myData',this.myData)
          console.log('myNotifies',this.myNotifies)
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
});
