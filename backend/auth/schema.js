const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const myImagesScehma = new mongoose.Schema({
    imageUrl:{
        type:String,
        required:false
    },
    imageDate:{
        type:String,
        required:false,
    },
    imageId:{
        type:String,
        required:false
    }
})


const locationAdressDetailSchema = new mongoose.Schema({
    city:{
        type:String,
        required:false
    },
    country:{
        type:String,
        required:false
    },
    address:{
        type:String,
        required:false
    },
    lat:{
        type:Number,
        required:false
    },
    lng:{
        type:Number,
        required:false
    },
    locationUpdateDate:{
        type:String,
        required:false,
    },
})

const cvDetailSchema = new mongoose.Schema({
    selectedCvFileUrl:{
        type:String,
        required:false
    },
    selectedCvDate:{
        type:String,
        required:false,
        default:new Date().toLocaleString()
    },
    selectedCvId:{
        type:String,
        required:false,
        default:uuidv4()
    },
    selectedCvFileName:{
        type:String,
        required:false,
    },
    selectedCvFileType:{
        type:String,
        required:false
    }
})


const birthdaySchema = new mongoose.Schema({
    birthdayDate:{
        type:String,
        required:false
    },
    birthdayHour:{
        type:String,
        required:false
    }
})


const educationSchema  = new mongoose.Schema({
    educationDegreeType:{
        type:String,
        required:false
    },
    educationLocationName:{
        type:String,
        required:false
    },
    educationDepartmentName:{
        type:String,
        required:false
    },
    educationStartDate:{
        type:String,
        required:false
    },
    educationFinishDate:{
        type:String,
        required:false
    },
    educationStatus:{
        type:Boolean,
        required:false
    },
    educationId:{
        type:String,
        required:false,
        default:uuidv4()
    },
    educationAddedDate:{
        type:String,
        required:false,
        default:new Date().toLocaleString()
    }
})

const workExperienceSchema = new mongoose.Schema({
    workPosition:{
        type:String,
        required:false
    },
    workCompanyName:{
        type:String,
        required:false
    },
    workDepartmentName:{
        type:String,
        required:false
    },
    workStartDate:{
        type:String,
        required:false
    },
    workFinishDate:{
        type:String,
        required:false
    },
    workStatus:{
        type:Boolean,
        required:false
    },
    workId:{
        type:String,
        required:false,
        default:uuidv4()
    },
    workAddedDate:{
        type:String,
        required:false,
        default:new Date().toLocaleString()
    }
})

const socialMediaLinksSchema = new mongoose.Schema({
    linkUrl:{
        type:String,
        required:false
    },
    linkId:{
        type:String,
        required:false,
        default: uuidv4()
    },
    linkAddedDate:{
        type:String,
        required:false,
        default:new Date().toLocaleString()
    },
    linkName:{
        type:String,
        required:false
    },
    linkIcon:{
        type:String,
        required:false
    },
    linkPlatformType:{
        type:String,
        required:false
    }
})

const searchingPositionsSchema = new mongoose.Schema({
    positionName:{
        type:String,
        required:false
    },
    positionAddedDate:{
        type:String,
        required:false
    },
})


const skillsSchema = new mongoose.Schema({
    skillName:{
        type:String,
        required:false
    },
    skillId:{
        type:String,
        required:false,
    },
    skillAddedDate:{
        type:String,
        required:false,
        default:new Date().toLocaleString()
    }
})


const UserSchema = new mongoose.Schema({
    searchingPositions:[searchingPositionsSchema],
    skills:[skillsSchema],
    socialMediaLinks:[socialMediaLinksSchema],
    totalWorkExperience:{
        type:Number,
        required:false
    },
    works:[workExperienceSchema],
    educations:[educationSchema],
    birthdayDate:birthdaySchema,
    gender:{
        type:String,
        required:false
    },
    selectedCvFile:cvDetailSchema,
    locationAdressDetail:locationAdressDetailSchema,
    dialCode:{
        type:String,
        required:false
    },
    bio:{
        type:String,
        required:false
    },
    phoneNumber:{
        type:String,
        required:false
    },
    displayName:{
        type:String,
        required:false
    },
    name: {
      type: String,
      required: false,
    },
    surName:{
        type:String,
        required:false
    },
    fullName:{
        type:String,
        required:false
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    createdDate:{
        type:Date,
        default:Date.now,
        required:false
    },
    fireBaseId:{
        type:String,
        required:false
    },
    uniqueId:{
        type:String,
        required:false
    },
    userImage:{
        type:String,
        required:false
    },
    googleImage:{
        type:String,
        required:false
    },
    active:{
        type:Boolean,
        required:false,
        default:true
    },
    lastLoginDate:{
        type:String,
        required:false
    },
    safetyAnswer:{
        type:String,
        required:false
    },
    lastProfileUpdatedDate:{
        type:String,
        required:false
    },
    totalStorage:{
        type:Number,
        required:false,
        default:15
    },
    loginType:{
        type:String,
        required:false
    },
    adminStatus:{
        type:Boolean,
        required:false,
        default:false
    },
    userDescription:{
        type:String,
        requierd:false
    },
    userName:{
        type:String,
        required:false
    },
    myImages:[myImagesScehma]
  });

  const User = mongoose.model('User', UserSchema);
  module.exports = User