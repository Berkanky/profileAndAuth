const express = require('express');
const app = express.Router();
const Advertise = require('./schema')
const User = require('../auth/schema')
const MyNotifies = require('../notify/schema')

app.get('/:firebaseId/getMyAdvertise',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const findadvertise = await Advertise.findOne({jobAdvertiserFirebaseId : firebaseId})
        if(findadvertise){
            const findadvertiseObj = findadvertise
            const finduser = await User.findOne({fireBaseId : findadvertise.jobAdvertiserFirebaseId})            
            if(finduser){
                Object.assign(findadvertise,{
                    jobAdvertiserDetails:finduser
                })
            }
            res.status(200).json({findadvertise:findadvertiseObj})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})

app.put('/:firebaseId/postAdveritse',async(req,res) =>{
    const {firebaseId} = req.params
    try{
        const resBody = {}
        const userData = req.body.userData
        const findme = await User.findOne({fireBaseId : firebaseId})
        if(findme){

            const advertiserUpdatedDetails = findme
            const newAdvertiseData = {
                jobAdvertiserId:findme._id,
                jobAdvertiserFirebaseId:firebaseId,
                jobAdvertiserDetails:{},
                mentionAboutMe:userData.mentionAboutMe
            }
            const checkmyadv = await Advertise.findOne({jobAdvertiserFirebaseId : firebaseId})
            if(!checkmyadv){
                const newPost = new Advertise(newAdvertiseData)
                await newPost.save()
                Object.assign(resBody,{
                    advertiseData:newPost
                })
            }else{
                Object.assign(checkmyadv,newAdvertiseData,{
                    jobAdvertiseDate:new Date().toLocaleString()
                })
                await checkmyadv.save()

                Object.assign(resBody,{
                    advertiseData:checkmyadv
                })

            }
            res.status(200).json({findme,resBody})
        }
    }catch(err){
        res.status(500).json({message:'Internal Servre err'})
    }
})


app.get('/:firebaseId/getAllAdvertisers',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const resBody = {
            checkStatusResult:false
        }

        const findmyadvertise = await Advertise.findOne({jobAdvertiserFirebaseId : firebaseId})
        if(findmyadvertise){
            Object.assign(resBody,{
                checkStatusResult:true
            })
        }

        res.status(200).json({checkStatusResult:resBody.checkStatusResult})

    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})

app.put('/:firebaseId/removeMyAdvertise',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const resBody = {}

        const getmyadvertise = await Advertise.findOne({jobAdvertiserFirebaseId : firebaseId })
        if(getmyadvertise){

            Object.assign(getmyadvertise,{
                jobAdvertisePostEndDate:new Date().toLocaleString()
            })

            const findme = await User.findOne({fireBaseId : firebaseId})
            if(findme){
                const getmynotifies = await MyNotifies.findOneAndUpdate(
                    {userId : findme._id},
                    {$push : {myOldJobAdvertises : getmyadvertise}},
                    {new:true,upsert:true}
                )
                Object.assign(resBody,getmynotifies)
            }
        }


        const findmyadvertise = await Advertise.findOneAndRemove({jobAdvertiserFirebaseId : firebaseId})

        const getmeagain = await User.findOne({fireBaseId : firebaseId})

        res.status(200).json({findmyadvertise,getmeagain,resBody})
    }catch(err){
        res.status(500).json({message:'Internal  Server Err'})
    }
})


app.get('/:firebaseId/getMyJobAdvertises',async(req,res) => {
    const {firebaseId} = req.params
    try{
        let allUsersList = await User.find()
        const findme = await User.findOne({fireBaseId : firebaseId})
        if(findme && allUsersList.length > 0){
            const mynotifies = await MyNotifies.findOne({userId : findme._id})
            if(mynotifies){
                
                const check = 'myOldJobAdvertises' in mynotifies
                if(check){
                    let myJobAdvertises = []
                    mynotifies.myOldJobAdvertises.forEach(element => {
                        const newObj = {}
                        Object.assign(newObj,element)
                        const finduser = allUsersList.find(
                            object => String(object._id) === String(element.jobAdvertiserId)
                        )
                        if(finduser){
                            Object.assign(newObj,{
                                jobAdvertiserDetails:finduser
                            })
                            myJobAdvertises.push(newObj)
                        }
                    });
                    res.status(200).json({myJobAdvertises})
                }
                
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})



app.put('/:firebaseId/updateMyHideLocationDetails',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const hideLocationDetailsUpdated = req.body.hideLocationDetailsUpdated
        const findmyadvertise = await Advertise.findOne({jobAdvertiserFirebaseId : firebaseId})
        if(findmyadvertise){
            const check = 'hideLocationDetails' in findmyadvertise
            if(check === true){
                findmyadvertise.hideLocationDetails = hideLocationDetailsUpdated
            }else{
                Object.assign(findmyadvertise,{
                    hideLocationDetails:hideLocationDetailsUpdated
                })
            }
            await findmyadvertise.save()
            res.status(200).json({findmyadvertise})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server  Err'})
    }
})

app.put('/:firebaseId/updateHideAdvertiseStatus',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const newhideAdvertiseStatus = req.body.hideAdvertiseStatus
        const filter = { jobAdvertiserFirebaseId : firebaseId }
        const update = { hideAdvertiseStatus : newhideAdvertiseStatus }

        const findadvertise = await Advertise.findOneAndUpdate(filter,update)

        res.status(200).json({findadvertise})

    }catch(er){
        res.status(500).json({message:'Internal SErvre Err'})
    }
})

app.put('/:firebaseId/updatelookingForJob',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const updatedlookingforjobstatus = req.body.lookingForJob
        const filter = {jobAdvertiserFirebaseId : firebaseId}
        const update = {lookingForJob : updatedlookingforjobstatus}
        const findadvertise = await Advertise.findOneAndUpdate(filter,update)
        res.status(200).json({findadvertise})
        
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})


app.put('/:firebaseId/updategalleryactive',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const hideGalleryActiveupdated = req.body.hideGalleryActive
        const filter = {jobAdvertiserFirebaseId : firebaseId}
        const update = {hideGalleryActive : hideGalleryActiveupdated}
        const findadvertise = await Advertise.findOneAndUpdate(filter,update)
        res.status(200).json({findadvertise})
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})


//getselected advertise detail


app.get('/:selectedAdvertiseId/getDetailAdvertise',async(req,res) =>{
    const {selectedAdvertiseId} = req.params
    try{
        const findadvertise =  await Advertise.findOne({_id : selectedAdvertiseId})
        if(findadvertise){
            const newObj = findadvertise
            //jobAdvertiserDetails
            const jobAdvertiserDetail = await User.findOne({fireBaseId : findadvertise.jobAdvertiserFirebaseId})
            if(jobAdvertiserDetail){
                Object.assign(newObj,{
                    jobAdvertiserDetails:jobAdvertiserDetail
                })
            }

            //hideAdvertiseStatus, hideGalleryActive, hideLocationDetails

            const firstCheck = 'hideLocationDetails' in newObj
            if(firstCheck){
                const val = newObj.hideLocationDetails === false ? true : false
                if(val === true){
                    newObj.jobAdvertiserDetails.locationAdressDetail = {}
                }
            }

            const secondCheck = 'hideGalleryActive' in newObj
            if(secondCheck){
                if(newObj.hideGalleryActive === false){
                    newObj.jobAdvertiserDetails.myImages = []
                    newObj.jobAdvertiserDetails.googleImage = ''
                    newObj.jobAdvertiserDetails.userImage = ''
                }
            } 

            const hideAdvertiseStatusVal = {active:false}
            const thirdCheck = 'hideAdvertiseStatus' in newObj 
            if(thirdCheck){
                const thirdCheckVal = newObj.hideAdvertiseStatus === true ? true : false
                if(thirdCheckVal === true){
                    //Object.assign(newObj,{})
                    Object.assign(hideAdvertiseStatusVal,{
                        active:true
                    })
                    //console.log('nonactive')
                }else{
                    Object.assign(hideAdvertiseStatusVal,{
                        active:false
                    })
                    //console.log('active')
                }
            }

            res.status(200).json({findadvertise: hideAdvertiseStatusVal.active === true ? {} : newObj})
        }
    }catch(err){
        res.status(500).json({message:'Internal Servre ERr'})
    }
})

const makeFilterForEach = () => {
    //
}

//get all job advertises
app.get('/:firebaseId/getAllAdvertises',async(req,res) => {
    const {firebaseId} = req.params
    try{
        let allUsersList = await User.find()
        let allAdvertises = await Advertise.find()
        const check = allAdvertises.length > 0 && allUsersList.length > 0 ? true : false
        if(check === true){

            //hideAdvertiseStatus, hideGalleryActive, hideLocationDetails

            allAdvertises.forEach((element) => {
                const result = allUsersList.find(
                    object => String(object.fireBaseId) === String(element.jobAdvertiserFirebaseId)
                )
                if(result){
                    Object.assign(element,{
                        jobAdvertiserDetails:result
                    })
                    //console.log(result._id)
                }
            });

            const removeFromListFunction = (element) => {
                allAdvertises = allAdvertises.filter(
                    object => String(object._id) !== String(element._id)
                )
            }


            allAdvertises.forEach(element => {
                const firstCheck = 'hideAdvertiseStatus' in element
                if(firstCheck){
                    const hideAdvertiseStatusVal = element.hideAdvertiseStatus === true ? true : false
                    if(hideAdvertiseStatusVal === true){
                        removeFromListFunction(element)
                    }
                }

                const secCheck = 'hideGalleryActive' in element
                if(secCheck){
                    const hideGalleryActiveVal = element.hideGalleryActive === true ? true : false
                    if(hideGalleryActiveVal === false){
                        element.jobAdvertiserDetails.myImages = []
                        element.jobAdvertiserDetails.userImage = ''
                        element.jobAdvertiserDetails.googleImage = ''
                    }
                }

                const thirdCheck = 'hideLocationDetails' in element
                if(thirdCheck){
                    const hideLocationDetailsVal = element.hideLocationDetails === false ? true : false
                    if(hideLocationDetailsVal === true){
                        element.jobAdvertiserDetails.locationAdressDetail = {}
                    }   
                }
            });

            res.status(200).json({allAdvertises})
        }
    }catch(err){
        res.status(500).json({message:'Interanl Servre err'})
    }
})

module.exports = app