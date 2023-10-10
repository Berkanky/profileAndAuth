const express = require('express');
const app = express.Router();
const User = require('../auth/schema')
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const MyNotifies = require('../notify/schema')
const Deleteduser = require('../deleteUsersCrud/schema')


const currentDateFunction = () => {
    const date = new Date().toLocaleString()
    return date
}

const sendEmailFunction = (allBody) => {
    const newBody = {}
    const currentDate = currentDateFunction()
    const randomId = uuidv4()
    const textVal = 'Please Copy UID for Account Delete Process-> '
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'yusufbk92@gmail.com',
          pass: 'nyfiapkrazpbbgto'
        }
      });
      var mailOptions = {
        from: 'yusufbk92@gmail.com',
        to: allBody.userData.email,
        subject: 'Account Delete SYNC Auth Code',
        html: `
            <div style="display: flex;justify-content: space-between;">
                <div>${textVal}</div>
                <a style="font-weight:bold;text-decoration:none;margin-left:5%;">${randomId}</a>
            </div>
            <div>${currentDate}</div>
        `
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

    Object.assign(newBody,{
        vertificationId:randomId,
        textVal:textVal,
        toEmail: allBody.userData.email,
        currentDate:currentDate
    })
    return newBody
}


app.put('/:firebaseId/sendCodeForDelete',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const allBody = {}
        const findme = await User.findOne({fireBaseId : firebaseId})
        if(findme){
            const findmynotifies = await MyNotifies.findOne({userId : findme._id})

            Object.assign(allBody,{
                userData:findme,findmynotifies
            })
            const newBody = sendEmailFunction(allBody)

            Object.assign(allBody,{
                newBody
            })

            res.status(200).json({allBody})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server ERr'})
    }
})

app.put('/:firebaseId/removeMyAllData',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const allReqBody = req.body
        const resBody = {}
        const allBody = {}
        const findme = await User.findOne({fireBaseId : firebaseId})
        if(findme){
            Object.assign(allBody,{
                userData:findme
            })
            const thanksEmail = sendThanskEmail(allBody)
            const check = await Deleteduser.findOne({email : findme.email})
            const newData = {
                email:findme.email ?? '',
                deleteDate:currentDateFunction(),
                deleteDescription:allReqBody.deleteConfirmData.deleteDescription,
                deletedUserId:findme._id,
                deletedUserFirebaseId:findme.fireBaseId
            }
            if(!check){
                // deleteConfirmData:this.deleteConfirmData
                const newObjDeleteduser = new Deleteduser(newData)
                await newObjDeleteduser.save()
                Object.assign(resBody,{
                    deletedUser:newObjDeleteduser
                })
            }else{
                const filter = {email : findme.email}
                const update = newData
                const findandupdatedeleted = await Deleteduser.findOneAndUpdate(filter,update)
                Object.assign(resBody,{
                    deletedUser:findandupdatedeleted
                })
            }
            const mynotifies = await MyNotifies.findOneAndDelete({userId : findme._id})
            const deleteme = await User.findOneAndDelete({_id : findme._id})

            Object.assign(resBody,{
                mynotifies,deleteme,thanksEmail
            })
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})

const sendThanskEmail = (allBody) => {
    const newBody = {}
    const currentDate = currentDateFunction()
    const textVal = 'Account Deleted, Thank You For Everything.'
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'yusufbk92@gmail.com',
          pass: 'nyfiapkrazpbbgto'
        }
      });
      var mailOptions = {
        from: 'yusufbk92@gmail.com',
        to: allBody.userData.email,
        subject: `Thank You For Everything ${allBody.userData.email ?? ''}`,
        html: `
            <div style="display: flex;justify-content: space-between;">
                <div>${textVal}</div>
            </div>
            <div>${currentDate}</div>
        `
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

    Object.assign(newBody,{
        textVal:textVal,
        toEmail: allBody.userData.email,
        currentDate:currentDate
    })
    return newBody
}


module.exports = app