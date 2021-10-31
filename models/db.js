const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/employee").then(()=>{
    console.log("connection established");
}).catch(()=>{
    console.log("no connection");
})