const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const User = require('../models/User');


router.get("/", (req, res) => {
    res.send("Auth");
});

const auth=async(req,res,next)=>{
    const token=req.header('auth-token');
    if(!token){
        res.json({
            message:"Access Denied"
        });
    }

    const verfiy=  jwt.verify(token,process.env.JWT_SECRET);
    req.user=verfiy;
    next();
}; 


router.post("/login", async (req, res) => {
    const {
        email,
        password
    } = req.body;

    if (!email || !password) {
        res.json({
            message: "Please provide email and password",
        });
    }


    const user = await User.findOne({
        email: email
    });


    if (!user) {
        res.json({
            message: "The email is not yet registered to an account"
        });
    }

    const checkPassword = await bcryptjs.compare(password, user.password);
    if (!checkPassword) {
        res.json({
            message: "The password does not match"
        });
    }
    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });

    res.header('auth-token',token).json({
        isLogged: true,
        token,
        user
    });
});


router.post("/signup", async (req, res) => {
    const {
        username,
        password,
        email
    } = req.body;

    const emailExist=await User.findOne({email});
    if(emailExist){
        res.json({
            message: "The Email already exists"
        });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPass = await bcryptjs.hash(password, salt);


    const user = await User.create({
        username,
        email,
        password: hashPass
    });

    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });

    res.json({
        isLogged: true,
        token,
        user
    });
});

router.get("/me",auth ,async(req,res)=>{
    res.json(req.user.id);
});
module.exports = router;