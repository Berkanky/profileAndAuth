
const express = require('express');
const app = express.Router();
const User = require('../auth/schema')
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const MyNotifies = require('../notify/schema')

app.put('/:firebaseId/updateProfilePic',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const allData = req.body.imageData

        const imageUrl = req.body.imageData.url ?? req.body.imageData.imageUrl

        const filter = {fireBaseId : firebaseId}
        const update = {userImage : imageUrl, lastProfileUpdatedDate:new Date().toLocaleString()}

        const findme = await User.findOneAndUpdate(filter,update)
        if(findme){
            const getmeagain = await User.findOne({fireBaseId : firebaseId})
            if(getmeagain){
                res.status(200).json({findme:getmeagain})
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})


app.put('/:firebaseId/addSelectedImages',async(req,res) => {
    const {firebaseId} = req.params
    try{
        let myImageList = req.body.myImageList
        myImageList.forEach(element => {
            Object.assign(element,{
                imageId:uuidv4(),
                imageDate:new Date().toLocaleString(),
                imageUrl:element.url,
            })
        });
 
        const findme = await User.findOne({fireBaseId : firebaseId})
        if(findme){
            const check = 'myImages' in findme
            if(check){
                myImageList.forEach(element => {
                    findme.myImages.push(element)
                });
            }else{
                Object.assign(findme,{
                    myImages:myImageList
                })
            }
            await findme.save()
            res.status(200).json({findme})
        }

    }catch(err){    
        res.status(500).json({message:'Internal Server Err'})
    }
})

app.put('/:firebaseId/removeSelectedImage',async(req,res)=>{
    const {firebaseId} = req.params
    try{
        const selectedImage = req.body.selectedImage

        const findme = await User.findOne({fireBaseId : firebaseId})
        if(findme){
            const findimage = findme.myImages.some(
                object => String(object.imageId) === String(selectedImage.imageId)
            )
            if(findimage){
                findme.myImages = findme.myImages.filter(
                    object => String(object.imageId) !== String(selectedImage.imageId)
                )
            }
            await findme.save()
            res.status(200).json({findme})
        }
    }catch(err){
        res.status(500).json({message:'Interanl Server ERr'})
    }
})


app.get('/:firebaseId/getMyImages',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const findme = await User.findOne({fireBaseId : firebaseId})
        if(findme){
            let myImages = []
            const check = 'myImages' in findme
            if(check){
                myImages = findme.myImages
            }

            res.status(200).json({findme,myImages})

        }
    }catch(err){
        res.status(500).json({message:'Internal Servre Err'})
    }
})

app.put('/:firebaseId/removeSelectedImages',async(req,res) => {
    const {firebaseId} = req.params
    try{
        let selectedImages = req.body.selectedImages
        const findme = await User.findOne({fireBaseId : firebaseId})
        if(findme){
            /* this.mySkills = this.mySkills.filter(
  element => !this.deleteList.find(object => object._id === element._id)
) */
                findme.myImages = findme.myImages.filter(
                    element => !selectedImages.find(
                        object => String(object._id) === String(element._id)
                    )
                )
                await findme.save()
                res.status(200).json({findme,selectedImages})
        }
    }catch(err){
        res.status(500).json({message:'Internal Servre Err'})
    }
})

module.exports = app