require('dotenv').config()
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 3000;
require("./db/conn");
const Register =  require("./models/register");
const auth = require("./middleware/auth");

//const static_path = path.join(__dirname,"../public");
const template_path = path.join(__dirname,"../templates/views");
const partials_path = path.join(__dirname,"../templates/partials");

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);
//app.use(express.static(static_path));

//console.log(process.env.SECRET_KEY);

app.get("/", (req,res) => {
    res.render("index");
})

app.get("/register", (req,res) => {
    res.render("register");
})

app.get("/login",(req,res) => {
    res.render("login");
})

app.get("/secret", auth, async(req,res) => {
    res.render("secret");
})

app.get("/logout", auth, async(req,res) => {
    try {

        // for single logout
        // req.user.tokens = req.user.tokens.filter((currElement) => {
        //     return currElement.token!== req.token
        // })

        // logout all at once
        req.user.tokens = [];

        res.clearCookie("jwt");
        console.log("logout successfully");
        await req.user.save();
        res.render("login");
    } catch(error){
        res.status(500).send(error);
    }
})

app.post("/register", async(req,res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        if(password===cpassword)
        {
            const registerMember = new Register({
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                email : req.body.email,
                gender : req.body.gender,
                phone : req.body.phone,
                age : req.body.age,
                password : password,
                confirmPassword : cpassword,
            })

            const token = await registerMember.generateAuthToken();
            console.log(`the token part is ${token}`);

             //res.cookie(`jwt`, `token`,);
             res.cookie('jwt', token, { expires: new Date(Date.now() + 30000)
                //, httpOnly: true
             })
             //console.log("cookie"+cookie);

            const registered = await registerMember.save();
            res.status(201).render("login");

        }
        else {
            res.send("both password must be same");
        }
    } catch(e){
        res.status(400).send(e);
    }
})


app.post("/login", async(req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        const memberEmail = await Register.findOne({email:email});
        // decrypting hashing
        const isMatch = await bcrypt.compare(password, memberEmail.password);
        
        // token
        const token = await memberEmail.generateAuthToken();
        console.log(`the token part is ${token}`);

        res.cookie('jwt', token, { expires: new Date(Date.now() + 30000)
            //, httpOnly: true
         })

        if(isMatch)
        {
            res.status(201).render("index");
        }else {
            res.send("invalid password details");
        }
    }
    catch(e){
        res.status(400).send("invalid login details");
    }
})


app.listen(port, ()=>{
    console.log(`connected at port ${port}`);
})