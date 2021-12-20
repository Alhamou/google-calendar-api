require('dotenv').config()
const express = require("express")
const app = express()


app.get("/", async (req, res)=>{

  res.json({timeZone: ""})

})
app.use("/google-calendar", require("./google-calendar"))



app.listen(3000, function(){
  console.log("APP Started on Post 3000")
})


