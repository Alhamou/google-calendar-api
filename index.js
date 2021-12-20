require('dotenv').config()
const express = require("express")
const app = express()




app.use("/google-calendar", require("./google-calendar"))



app.listen(3000, function(){
  console.log("APP Started on Post 3000")
})


