
const express = require("express")
const router = new express.Router()
const { google } = require('googleapis')
const googleAuthController = require("./googleAuthController")


router.get("", async (req, res)=>{


    try{

        const response = await googleAuthController.resaveData(req.query)

        res.send({result: "success", response})
        
    }catch(error){

        res.status(400).send({result: "error", error})
    }


})



module.exports = router;