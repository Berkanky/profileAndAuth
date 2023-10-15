const mongoose = require('mongoose');

const welcomeMessageObject = new mongoose.Schema({
    date:{
        type:String,
        required:false,
    },
    message:{
        type:String,
        required:false,
    }
})



const MyNotifiesSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    welcomeMessage:{
        type:welcomeMessageObject,
        required:false
    },   
    myFriendsId:[],
    myOldJobAdvertises:[]
}) 

const MyNotifies = mongoose.model('MyNotifies',MyNotifiesSchema)
module.exports = MyNotifies