const mongoose = require("mongoose");
const validator = require("validator");
const db = require("./db");


const employeeSchema = new mongoose.Schema({
    fullname : {
        type:String,
        required:true,
        trim:true,
    },
    email : {
        type:String,
        required:true,
        trim:true,
        //unique:[true,{message:"email already exists"}],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("email invalid");
            }
        },
        // validate(value)
        // {
        //         const as = db.Employees.findOne({email:value});
        //         if(!as){
        //             throw new Error("email not unique");
        //         }

        //         else{
        //             console.log("jdsnskjf");
        //         }
            
        // }
    },
    mobile : {
        type:Number,
        required:true,
        trim:true,
    },
    city : {
        type:String,
        required:true,
        trim:true,
    },
})




const Employee = new mongoose.model("Employee",employeeSchema);
// function a(val){
//     console.log(db.employees.findOne({email:val})); 
//     return db.Employees.findOne({email:val});

// }
module.exports = Employee;