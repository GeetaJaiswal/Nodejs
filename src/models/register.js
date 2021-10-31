const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim : true
    },
    lastname: {
        type: String,
        required: true,
        trim : true
    },
    email: {
        type: String,
        required: true,
        trim : true,
        unique: true,
    },
    gender: {
        type: String,
        required: true,
        trim : true
    },
    phone: {
        type: Number,
        required: true,
        trim : true
    },
    age: {
        type: Number,
        required: true,
        trim : true
    },
    password: {
        type: String,
        required: true,
        trim : true
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }]
})

// generating token
registerSchema.methods.generateAuthToken = async function(){   // methods bcoz calling function using instance
    try{
        console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()}, "process.env.SECRET_KEY");
        this.tokens = this.tokens.concat({token:token})  //saving token value to token field in DB
        await this.save();
        console.log("hello"+token);
        return token;
    }catch(e){
        res.send(`the error part is ${error}`); 
        console.log(`the error part is ${error}`);
    }
}


// password hashing
registerSchema.pre("save", async function(next){
    if(this.isModified("password"))
    {
        console.log(this.password);
        this.password = await bcrypt.hash(this.password,10);
        console.log(this.password);
    }
    next();
})


const Register = new mongoose.model("Register",registerSchema);

module.exports = Register;