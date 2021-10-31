const express = require("express");
const app = express();
const port =  process.env.PORT || 3000;
const router = require("./controllers/employeeControllers");
require("./models/db");

app.set("view engine","hbs");
// const bodyParser = require("body-parser");

// const Employee = require("./models/employee-model");
app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.use(router);
app.set("view engine","hbs");


// app.use(bodyParser.urlencoded({ extended:true}));
// app.use(bodyParser.json());

app.listen(port,()=>{
    console.log(`running at port ${port}`);
})