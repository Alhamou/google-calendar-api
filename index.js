require('dotenv').config()
const express = require("express")
const app = express()


app.use("/google", require("./google-auth"))



app.listen(3000, function(){
  console.log("APP Started on Post 3000")
})


