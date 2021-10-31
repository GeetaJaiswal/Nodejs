const jwt = require("jsonwebtoken");
const Register = require("../models/register");

const auth = async (req,res,next) => {
    try{

        const token = req.cookies.jwt; //getting cookie whose name is jwt
        const verifyUser = jwt.verify(token, "process.env.SECRET_KEY"); //jwt.verify() is a jwt function for authentication, if user is verified it will return its id (user id)
        console.log(`verified user id ${verifyUser._id}`);
        console.log(`verified user ${verifyUser}`);
        console.log(`process env secret key ${process.env.SECRET_KEY}`);

        const user = await Register.findOne({_id:verifyUser._id})
        console.log(user);
        // console.log(req);
        req.token=token;
        req.user=user;
        next();
    }
    catch(error){
        res.status(401).send(error);
    }
}

module.exports = auth;