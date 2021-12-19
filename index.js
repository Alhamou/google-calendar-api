require('dotenv').config()
const express = require("express")
const app = express()



app.get("/", async (req, res)=>{

  const googleAuthController = require("./googleAuthController")

  const url = await googleAuthController.getUrlAuth()
 
  res.json({result: "Index page success", url})
  
})



app.use("/singin", require("./singin"))



app.listen(3000, function(){
  console.log("APP Started on Post 3000")
})


