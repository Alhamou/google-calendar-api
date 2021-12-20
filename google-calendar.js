
const express = require("express")
const router = new express.Router()
const googleCalendarController = require("./googleCalendarController")


/**
 * root: /
 */
router.get("", async (req, res)=>{

    try{
  
      const url = await googleCalendarController.getUrlAuth()
   
      res.json({result: "Index page success", url})
  
      }catch(error){
  
          res.status(400).send({result: "error", error})
      }
    
})


/**
 * root: /singin
 */
router.get("/register", async (req, res)=>{


    try{

        const response = await googleCalendarController.provideObjectData(req.query)

        res.send({result: "success", response})
        
    }catch(error){

        res.status(400).send({result: "error", error})
    }


})






module.exports = router;