
const express = require("express")
const router = new express.Router()
const googleCalendarController = require("./googleCalendarController")


// root: /
router.get("/", async (req, res)=>{

    try{
  
      const data = await googleCalendarController.setAppointment()
      
      res.json({status: data.status, data: data})
  
    }catch(error){
  
      res.status(400).json({error: error})
    }
  
  })


/**
 * root: /auth
 */
router.get("/auth", async (req, res)=>{

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
router.get("/callback", async (req, res)=>{


    try{

        const response = await googleCalendarController.provideObjectData(req.query)

        res.send({result: "success", response})
        
    }catch(error){

        res.status(400).send({result: "error", error})
    }


})






module.exports = router;