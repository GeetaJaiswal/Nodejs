const express = require("express");
const app = express();
const router = express.Router();
const Employee = require("../models/employee-model");
const db = require("../models/db");

// app.use(express.urlencoded({extended:true}));

// app.use(express.json());

router.get("/", (req,res) => {
    res.render("index");
})

router.get("/insert", (req,res) => {
    res.render("addOrEdit",{
        viewTitle:"Insert Employee Data",
    });
})

function handleValidationError(err,body){
    for(field in err.errors)
    {
        switch(err.errors[field].path){
        case 'fullname':
              body['fullnameError'] = err.errors[field].message;
              break;
        
        case 'email':
              body['emailError'] = err.errors[field].message;
            //  body['Uemail'] = "Email already exists";
              break;

        case 'mobile':
              body['mobileError'] = err.errors[field].message;
              break;
            
        case 'city':
            body['cityError'] = err.errors[field].message;
            break;
        
        default:
           break;
        }
    }
}

router.post("/employee",(req,res) => {
    if(req.body.id==""){
        insertRecord(req,res);
    }
    else{
        updateRecord(req,res);
    }
});


const insertRecord = async (req,res) => {
    try{
            const email = req.body.email;
            //const Cemail = checkEmail(email);
            const Cemail = await Employee.findOne({email:email}).countDocuments();
            if(Cemail!=1)
            {
                const employeeData = new Employee({
                    fullname : req.body.fullname,
                    email : req.body.email,  
                    mobile : req.body.mobile,
                    city : req.body.city,
                })
                const employeeDataSave = await employeeData.save();
                res.status(201).redirect("/list");
            }
    }
        catch(err){
            console.log(err);
            if(err.name == "ValidationError"){
                handleValidationError(err,req.body);
                res.status(400).render("addOrEdit",{
                    employee:req.body,
                })
            } 
        }
}


router.get("/list", async (req,res) => {
    try{
        await Employee.find((err,docs) => {
            if(!err) {
                res.render("list", {
                    list:docs,
                })
            }
        })
    }
    catch(err){
        console.log(`Error in retrieving employee list: ${err}`);
    }
})



router.get('/employee/:id', async (req,res)=>{
    try{
        await Employee.findById({_id:req.params.id}, (err,doc) => {
        if(!err){
            res.render("addOrEdit", {
            viewTitle: "Update Employee Data",
            employee:doc,
            })
        }
    })
    }
    catch(err){
        console.log(err);
    }
})



const updateRecord = async (req,res) => {
    try {
        await Employee.findOneAndUpdate({_id:req.body.id}, req.body, {new:true}, (err,doc)=>{
            if(!err){
                res.redirect("/list");
            }
        })
    }
    catch(err){
            if(err.name=="ValidationError")
            {
                handleValidationError(err, req.body);
                res.render("addOrEdit", {
                    viewTitle:"Update Employee Data",
                    employee: req.body,
                })
            }
    }
    
}


router.get('/employee/delete/:id', async (req,res)=>{
    try{
        await Employee.findByIdAndDelete({_id:req.params.id}, (err,doc) => {
            if(!err){
                res.redirect('/list');
            }
        })
    }
    catch(err)
    {
        res.redirect({
            deleteErr: "Update Employee Data",
        },"/list")
    }
})



module.exports = router;