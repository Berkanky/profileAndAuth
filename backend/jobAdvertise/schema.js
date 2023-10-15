const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const User = require('../auth/schema')




const jobAdvertiseSchema = new mongoose.Schema({
    jobAdvertiseId:{
        type:String,
        required:false,
        default:uuidv4()
    },
    jobAdvertiseDate:{
        type:String,
        required:false,
        default:new Date().toLocaleString()
    },
    jobAdvertiserId:{
        type:String,
        required:false
    },
    jobAdvertiserFirebaseId:{
        type:String,
        required:false
    },
    jobAdvertiserDetails:{
        type: mongoose.Schema.Types.Mixed,
        required:false
    },
    mentionAboutMe:{
        type:String,
        required:false
    },
    jobAdvertisePostEndDate:{
        type:String,
        required:false
    },
    declinedStatus:{
        type:Boolean,
        required:false,
        default:false
    },
    confirmedStatus:{
        type:Boolean,
        required:false,
        default:false
    },
    hideLocationDetails:{
        type:Boolean,
        required:false,
        default:false
    },
    hideAdvertiseStatus:{
        type:Boolean,
        required:false,
        default:false
    },
    lookingForJob:{
        type:Boolean,
        required:false,
        default:true
    },
    hideGalleryActive:{
        type:Boolean,
        required:false,
        default:true
    }
})

const Advertise = mongoose.model('Advertise',jobAdvertiseSchema)
module.exports = Advertise