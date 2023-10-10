const mongoose = require('mongoose');



const deletedUserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:false
    },
    deleteDate:{
        type:String,
        required:false,
        default:new Date().toLocaleString()
    },
    deleteDescription:{
        type:String,
        required:false
    },
    deletedUserId:{
        type:String,
        required:false
    },
    deletedUserFirebaseId:{
        type:String,
        required:false
    }
})



const Deleteduser = mongoose.model('Deleted User',deletedUserSchema)
module.exports = Deleteduser