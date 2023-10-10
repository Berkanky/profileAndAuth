const express = require('express');
const app = express.Router();
const Advertise = require('./schema')
const User = require('../auth/schema')

app.get('/:firebaseId/getMyAdvertise',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const findadvertise = await Advertise.findOne({jobAdvertiserFirebaseId : firebaseId})
        if(findadvertise){
            res.status(200).json({findadvertise})
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
                jobAdvertiserDetails:advertiserUpdatedDetails,
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
        const findmyadvertise = await Advertise.findOneAndRemove({jobAdvertiserFirebaseId : firebaseId})

        const getmeagain = await User.findOne({fireBaseId : firebaseId})

        res.status(200).json({findmyadvertise,getmeagain})
    }catch(err){
        res.status(500).json({message:'Internal  Server Err'})
    }
})

module.exports = app