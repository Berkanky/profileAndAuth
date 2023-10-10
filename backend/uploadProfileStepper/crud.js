const express = require('express');
const app = express.Router();
const User = require('../auth/schema')
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const MyNotifies = require('../notify/schema')


app.put('/:firebaseId/uploadProfileStepper',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const newData = req.body.newData

        const filter = {fireBaseId : firebaseId}
        const update  = newData

        const findme = await User.findOneAndUpdate(filter,update)
        if(findme){

            const getmeagain = await User.findById(findme._id)

            res.status(200).json({findme:getmeagain,selectedCvFile:getmeagain.selectedCvFile ?? ''})
        }

    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})


app.put('/:firebaseId/removeCv',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const findme = await User.findOneAndUpdate(
            {fireBaseId : firebaseId},
            {$set : {selectedCvFile : {}} }
        )

        res.status(200).json({findme})

    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})

app.put('/:firebaseId/addNewEduaction',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const newEducationData = req.body.educationSchema

        const findme = await User.findOneAndUpdate(
            {fireBaseId : firebaseId},
            {$push : {educations : newEducationData} },
            {new:true}
        )
        
        if(findme){
            const getmeagain = await User.findOne({fireBaseId : firebaseId})
            if(getmeagain){
                res.status(200).json({findme:getmeagain})
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server err'})
    }
})

app.put('/:firebaseId/:educationId/removeEducation', async(req,res) => {
    const {firebaseId, educationId} = req.params
    try{
        const findme = await User.findOneAndUpdate(
            {fireBaseId : firebaseId},
            {$pull : {educations : {_id :educationId}}}
        )
        res.status(200).json({findme})
    }catch(err){
        res.status(500).json({message:'Internal  Server Err'})
    }
})

app.put('/:firebaseId/:educationId/editEducation',async(req,res) => {
    
    const {firebaseId,educationId} = req.params
    try{
        const selectedEducationForEdit = req.body.selectedEducationForEdit

        const findme = await User.findOne({fireBaseId : firebaseId})
        if(findme){
            const result = findme.educations.find(
                object => String(object._id) === String(educationId)
            )
            if(result){
                Object.assign(result,selectedEducationForEdit)
                await findme.save()
                res.status(200).json({findme})
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server err'})
    }
})


app.put('/:firebaseId/addNewWorkExperience',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const workExperienceSchema = req.body.workExperienceSchema
        const findme = await User.findOneAndUpdate(
            {fireBaseId : firebaseId},
            {$push : {works : workExperienceSchema}}
        )

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


app.put('/:firebaseId/:workExperienceId/removeWorkExperience',async(req,res) => {
    const {firebaseId, workExperienceId} = req.params
    try{
        const findme = await User.findOneAndUpdate(
            {fireBaseId : firebaseId},
            {$pull : {works : {_id : workExperienceId}}}
        )

        if(findme){
            const getmeagain = await User.findOne({fireBaseId : firebaseId})
            if(getmeagain){
                res.status(200).json({findme:getmeagain})
            }
        }

    }catch(err){
        res.status(500).json({message:'Internal Server err'})
    }
})


app.put('/:firebaseId/:workExperienceId/updateWorkExperience',async(req,res) => {
    const {firebaseId, workExperienceId} = req.params
    try{
        const selectedWorkForEdit = req.body.selectedWorkForEdit
        const findme = await User.findOne({fireBaseId : firebaseId})
        if(findme){
            const result = findme.works.find(
                object => String(object._id) === String(workExperienceId)
            )
            if(result){ // workadded date silinebilir
                Object.assign(result,selectedWorkForEdit,{
                    workAddedDate:new Date().toLocaleString()
                })
                await findme.save()

                const getmeagain = await User.findOne({fireBaseId : firebaseId})
                if(getmeagain){
                    res.status(200).json({findme:getmeagain})
                }   
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})



app.get('/:firebaseId/getSocialMediaLinks',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const findme = await User.findOne({fireBaseId : firebaseId})
        if(findme){
            let socialMediaLinks = findme.socialMediaLinks


            res.status(200).json({socialMediaLinks,findme})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})


app.put('/:firebaseId/addSocialMediaLink',async(req,res) => {
    const {firebaseId} = req.params
    try{

        const linkData = req.body.linkData
        const findme = await User.findOneAndUpdate(
            {fireBaseId: firebaseId},
            {$push : {socialMediaLinks : linkData}},
        )
        if(findme){
            const getmeagain = await User.findOne({fireBaseId : firebaseId})
            if(getmeagain){
                res.status(200).json({findme:getmeagain,linkData})
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})

app.put('/:firebaseId/:selectedLinkId/removeSocialMediaLink',async(req,res) => {
    const {firebaseId, selectedLinkId} = req.params
    try{
        const findme = await User.findOneAndUpdate(
            {fireBaseId : firebaseId},
            {$pull : {socialMediaLinks : {_id : selectedLinkId}}}
        )
        if(findme){
            res.status(200).json({findme})
        }

    }catch(err){
        res.status(500).json({message:'Internal Server err'})
    }
})

app.put('/:firebaseId/:selectedLinkId/updateLink',async(req,res) => {
    const {firebaseId, selectedLinkId} = req.params
    try{
        const newLinkData = req.body.newLinkData
        const findme = await User.findOne({fireBaseId : firebaseId})
        if(findme){
            const result = findme.socialMediaLinks.find(
                object => String(object._id) === String(selectedLinkId)
            )
            if(result){
                const newDate = new Date().toLocaleString()
                Object.assign(result,newLinkData,{
                    linkAddedDate:newDate
                })
                await findme.save()
                res.status(200).json({findme})
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})

app.get('/:firebaseId/getUserSkills',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const findme = await User.findOne({fireBaseId : firebaseId})
        if(findme){
            let skills = findme.skills
            res.status(200).json({skills,findme})
        }
    }catch(err){
        res.status(500).json({message:'Internal server Err'})
    }
})


app.put('/:firebaseId/addSkill',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const skillData = req.body.skillData
        Object.assign(skillData,{
            skillId:uuidv4(),
            skillName:(skillData.skillName).toLowerCase()
        })
        



        const findme = await User.findOne({fireBaseId : firebaseId})
        if(findme){

            const result = findme.skills.find(
                object => String(object.skillName) === String(skillData.skillName)
            )
            if(!result){
                const findme = await User.findOneAndUpdate(
                    {fireBaseId : firebaseId},
                    {$push : {skills : skillData}},
                    {new:true}
                )
            }else{
                Object.assign(result,skillData,{
                    skillAddedDate:new Date().toLocaleString()
                })   
                await findme.save()
            }


            const getmeagain = await User.findOne({fireBaseId : firebaseId})
            if(getmeagain){

                const getSkill = getmeagain.skills.find(
                    object => String(object.skillId) === String(skillData.skillId)
                )

                res.status(200).json({findme:getmeagain,getSkill})
            }
        }

    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})


app.put('/:firebaseId/:selectedSkillId/removeSkill',async(req,res) => {
    const {firebaseId, selectedSkillId} = req.params
    try{
        const findme = await User.findOneAndUpdate(
            {fireBaseId : firebaseId},
            {$pull : {skills : {_id : selectedSkillId}}}
        )

        if(findme){
            res.status(200).json({findme})
        }

    }catch(err){

    }
})

app.put('/:firebaseId/searchSkill',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const findme = await User.findOne({fireBaseId : firebaseId})
        if(findme){
            const searchVal = req.body.searchSkill.skillName

            const result = findme.skills.filter(
                object => String(object.skillName.toLowerCase()).includes(searchVal.toLowerCase())
            )
            res.status(200).json({result})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server err'})
    }
})


app.get('/:firebaseId/getCurrentLocation',async(req,res) =>{
    const {firebaseId} = req.params
    try{
        const findme = await User.findOne({fireBaseId : firebaseId})
        if(findme){
            const locationAdressDetail = findme.locationAdressDetail ?? {}

            res.status(200).json({findme,locationAdressDetail})

        }
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})

app.put('/:firebaseId/updateMyLocation',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const newLocationData = req.body.newLocationData
        Object.assign(newLocationData,{
            locationUpdateDate:new Date().toLocaleString()
        })
        const findme = await User.findOneAndUpdate(
            {fireBaseId : firebaseId},
            {$set : {locationAdressDetail : newLocationData}}
        )
        if(findme){
            const getmeagain = await User.findOne({fireBaseId : findme.fireBaseId})
            if(getmeagain){
                res.status(200).json({findme:getmeagain})
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})

app.put('/:firebaseId/removeMyLocation',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const findme = await User.findOne(
            {fireBaseId : firebaseId},
            {$set : {locationAdressDetail : {}}}
        )
        if(findme){
            const getmeagain = await User.findOne({fireBaseId : findme.fireBaseId})
            if(getmeagain){
                res.status(200).json({findme:getmeagain})
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server err'})
    }
})

app.get('/:firebaseId/getMyPositions',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const findme = await User.findOne({fireBaseId : firebaseId})
        if(findme){
            res.status(200).json({searchingPositions:findme.searchingPositions})
        }
    }catch(err){
        res.status(500).json({message:'Interanl Server Err'})
    }
})

app.put('/:firebaseId/addPosition',async(req,res) => {
    const {firebaseId} = req.params
    try{

        const positionData  = req.body.positionData
        Object.assign(positionData,{
            positionAddedDate:new Date().toLocaleString()
        })

        const findme = await User.findOne({fireBaseId : firebaseId})
        if(findme){
            const result = findme.searchingPositions.find(
                object => String(object.positionName.toLowerCase()) === String(positionData.positionName.toLowerCase())
            )
            if(!result){
                findme.searchingPositions.push(positionData)
            }else{
                Object.assign(result,positionData)
            }
            await findme.save()
            const getmeagain = await User.findById(findme._id)
            if(getmeagain){
                res.status(200).json({findme:getmeagain})
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Servre Err'})
    }
})

app.put('/:firebaseId/deleteSelectedSearchingPositions',async(req,res) => {
    const {firebaseId} = req.params
    try{
        let deleteList = req.body.deleteList
        const finduser = await User.findOne({fireBaseId : firebaseId})
        if(finduser){
            const check = 'searchingPositions' in finduser
            if(check){
                deleteList.forEach((element) => {
                    const checkelement = finduser.searchingPositions.find(
                        object => String(object._id) === String(element._id)
                    )
                    if(checkelement){
                        finduser.searchingPositions = finduser.searchingPositions.filter(
                            object => String(object._id) !== String(element._id)
                        )
                    }
                });

                await finduser.save()
                res.status(200).json({finduser})
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})


app.put('/:firebaseId/deleteSelectedSkills',async(req,res) => {
    const {firebaseId} = req.params
    try{
        let deleteList = req.body.deleteList
        const findme = await User.findOne({fireBaseId : firebaseId})
        if(findme){
            const check = 'skills' in findme
            if(check){
                findme.skills.forEach(element => {
                    const result = deleteList.some(
                        object => String(object._id) === String(element._id)
                    )
                    if(result){
                        findme.skills = findme.skills.filter(
                            object => object._id !== element._id
                        )
                        deleteList = deleteList.filter(
                            object => object._id !== element._id
                        )
                        console.log(element)
                    }
                });
            }
            await findme.save()
            res.status(200).json({findme})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})

module.exports = app