const express = require('express');
const app = express.Router();
const User = require('./schema')
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const MyNotifies = require('../notify/schema')


const sendEmailFunction = (allBody) => {

    const newBody = {}
    const currentDate = new Date().toLocaleString()
    const randomId = uuidv4()
    const textVal = 'Please Copy UID and Enter in Client -> '
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
        subject: 'Signup Vertification Code',
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


app.put('/vertificationCrud',async(req,res) => {
    try{
        const allBody = req.body
        const sendEmailVertification = sendEmailFunction(allBody)
        res.status(200).json({sendEmailVertification})

    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})


app.put('/:firebaseId/logoutUpdate',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const filter = {fireBaseId : firebaseId}
        const update = {
            active:false
        }
        const findme = await User.findOneAndUpdate(
            filter,update
        )
        if(findme){            
            const mynotifies = await MyNotifies.findOne({userId : findme._id})
            if(mynotifies){
                mynotifies.welcomeMessage.date = ''
                mynotifies.welcomeMessage.message = ''
                mynotifies.markModified('welcomeMessage')
                await mynotifies.save()
            }
            res.status(200).json({findme})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})



app.get('/:firebaseId/getUserDetail',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const resBody = {}

        const findme = await User.findOne({fireBaseId : firebaseId})
        if(findme){
            const mynotifies = await MyNotifies.findOne({userId : findme._id})
            if(mynotifies){
                Object.assign(resBody,{
                    findme,mynotifies
                })
            }
        }
        res.status(200).json({resBody})
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})

const updateLoaction = (findmyacc) => {

}

app.put('/:firebaseId/updateMyData',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const newData = req.body.newData
        Object.assign(newData,{
            lastProfileUpdatedDate:new Date().toLocaleString()
        })
        const filter = {fireBaseId : firebaseId}
        const update = newData
        const findmyacc = await User.findOneAndUpdate(filter,update)
        if(findmyacc){
            const getagain = await User.findOne({fireBaseId : firebaseId})
            if(getagain){
                res.status(200).json({findmyacc:getagain,newData})
            }
        } 

    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})


const updateMyUsersList = (resBody) => {
    let newList = []
    resBody.findedUsers.forEach((element) => {
        const newObj = {}
        const result = resBody.allNotifies.find(
            object => String(object.userId) === String(element._id)
        )
        if(result){
            const checkFriend = resBody.mynotifies.myFriendsId.some(
                object => String(object._id) === String(element._id)
            )
            Object.assign(newObj,{
                userDetail:element,
                userNotifies:result,
                friendActive:checkFriend
            })
            newList.push(newObj)
        }
    });
    return newList
}

app.put('/:firebaseId/findUser',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const resBody = {}

        const searchUser = req.body.searchUser

        const findme = await User.findOne({fireBaseId : firebaseId})
        if(findme){
            const mynotifies = await MyNotifies.findOne({userId : findme._id})
            if(mynotifies){
                Object.assign(resBody,{
                    mynotifies, findme
                })
            }
        }

        let allNotifies = await MyNotifies.find()
        let allUsers = await User.find()
        Object.assign(resBody,{
            firebaseId,allNotifies,
        })
        if(allUsers.length > 0 && allNotifies.length > 0){
            const result = allUsers.filter(
                object => (object.name || object.email || object.displayName || object.lastName).toLowerCase().includes(searchUser.toLowerCase())
            )
            let findedUsers = []
            if(result){
                findedUsers = result
                Object.assign(resBody,{
                    findedUsers
                })
                findedUsers = updateMyUsersList(resBody)
                Object.assign(resBody,{
                    findedUsers:findedUsers
                })
            }else{
                /* findedUsers = [
                    {userDetail:{}, userNotifies:{}}
                ] */
                findedUsers = []
                Object.assign(resBody,{
                    findedUsers
                })
            }

            res.status(200).json({resBody})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})


app.put('/:firebaseId/:selectedUserId/addOrRemoveFriend',async(req,res) => {
    const {firebaseId, selectedUserId} = req.params
    try{
        const findselecteduser = await User.findOne({_id : selectedUserId})
        const findme = await User.findOne({fireBaseId : firebaseId})
        if(findme && findselecteduser){
            const mynotifies = await MyNotifies.findOne({userId : findme._id})
            if(mynotifies){
                const checkselecteduser = mynotifies.myFriendsId.some(
                    object => String(object._id) === String(selectedUserId)
                )
                const newData = {_id : selectedUserId}
                if(checkselecteduser){
                    mynotifies.myFriendsId = mynotifies.myFriendsId.filter(
                        object => String(object._id) !== String(selectedUserId)
                    )
                }else{
                    mynotifies.myFriendsId.push(newData)
                }
                mynotifies.markModified('myFriendsId')
                await mynotifies.save()
                res.status(200).json({mynotifies,findselecteduser})
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})


app.get('/:firebaseId/getMyFriends',async(req,res) => {
    const {firebaseId} = req.params
    try{
        let allUsersList = await User.find()
        const findme = await User.findOne({fireBaseId : firebaseId})
        if(findme && allUsersList.length > 0){
            const mynotifies = await MyNotifies.findOne({userId : findme._id})
            if(mynotifies){
                let newList = []
                mynotifies.myFriendsId.forEach((element) => {
                    const newObject = {}
                    const findselecteduser = allUsersList.find(
                        object => String(object._id) === String(element._id)
                    )
                    if(findselecteduser){
                        Object.assign(newObject,{
                            friendActive:true,
                            userDetail:findselecteduser,
                            userNotifies:{}
                        })
                        newList.push(newObject)
                    }
                });    


                const checkNewList = newList.length > 0 ? true : false
                if(!checkNewList){
                    const messageWhenEmpty = {
                        userDetail:{},
                        userNotifies:{},
                        messageData:{
                            message:'Empty'
                        },
                        friendActive:null   
                    }
                    newList.push(messageWhenEmpty)
                }
                res.status(200).json({friendsList : newList})
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})



app.put('/:firebaseId/removeMyLocation',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const findme = await User.findOne({fireBaseId : firebaseId})
        if(findme){
            findme.locationAdressDetail = {}
            await findme.save()
            res.status(200).json({findme})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server ERr'})
    }
})




module.exports = app