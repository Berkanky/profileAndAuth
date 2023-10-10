const express = require('express');
const app = express.Router();
const MyNotifies = require('./schema')
const User = require('../auth/schema')



app.put('/:firebaseId/updateCurrentDetail',async(req,res) => {
    const {firebaseId} = req.params
    try{

        const anonCheck = req.body.userData.isAnonymous
        const resBody = {}
        const myData = {
            isAnonymous:req.body.userData.isAnonymous,
            email:req.body.userData.email,
            fireBaseId:firebaseId,
            active:true,
            lastLoginDate:new Date().toLocaleString(),
            googleImage:req.body.userData.photoURL,
            displayName:req.body.userData.displayName
        }
        const updateMyNotifieWelcomeMessage = {
            date:new Date().toLocaleString(),
            message:'Welcome'
        }

        if(!anonCheck){
            const checkMe = await User.findOne({fireBaseId : firebaseId})
            if(checkMe){
                const updateData = {
                    active:true,
                    lastLoginDate:new Date().toLocaleString(),
                }
                const filter = {fireBaseId : firebaseId}
                const findme = await User.findOneAndUpdate(filter,updateData)
                Object.assign(resBody,{
                    findme
                })
            }else{
                const findme = new User(myData)
                await findme.save()
                Object.assign(resBody,{
                    findme
                })
            }
            const findmynotifies = await MyNotifies.findOne({userId : resBody.findme})
            if(findmynotifies){
    
                const findmynotifies = await MyNotifies.findOneAndUpdate(
                    {userId : resBody.findme._id},
                    {$set : {welcomeMessage : updateMyNotifieWelcomeMessage}}
                )
                Object.assign(resBody,{
                    findmynotifies
                })
            }else{
                const findmynotifies = new MyNotifies(
                    {
                        userId:resBody.findme._id,
                        welcomeMessage:updateMyNotifieWelcomeMessage
                    }
                )
                await findmynotifies.save()
                Object.assign(resBody,{
                    findmynotifies
                })
            }

            res.status(200).json({resBody})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})







module.exports = app