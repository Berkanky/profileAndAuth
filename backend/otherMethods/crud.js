const express = require('express');
const app = express.Router();
const allDialCodes = require('./allDialCodes.json')



app.get('/:firebaseId/getAllDialCodes',async(req,res) => {
    const {firebaseId} = req.params
    try{

        const allDialCodesList = allDialCodes
        let onlyDialCodeList = []
        let onlyCountriesList = []
        allDialCodesList.forEach(element => {
            onlyDialCodeList.push(element.dial_code)
            onlyCountriesList.push(element.name)
        });

        res.status(200).json({allDialCodesList,onlyDialCodeList,onlyCountriesList})
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})








module.exports = app