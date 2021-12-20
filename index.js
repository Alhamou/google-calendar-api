require('dotenv').config()
const express = require("express")
const app = express()
const googleCalendarController = require("./googleCalendarController")

app.get("/", async (req, res)=>{

  try{

    const data = await googleCalendarController.sendTest()
    
    res.json({status: data.status, data: data})

  }catch(error){

    res.status(400).json({error: error})
  }

})
app.use("/google-calendar", require("./google-calendar"))



app.listen(3000, function(){
  console.log("APP Started on Post 3000")
})


