const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const User = require('../models/User');
const auth = require('../libs/auth');



router.post("/login", async (req, res) => {
    const {
        email,
        password
    } = req.body;

    if (!email || !password) {
        res.json({
            success: false,
            data: "Please provide email and password",
        });
    }


    const user = await User.findOne({
        email: email
    });


    if (!user) {
        res.json({
            success: false,
            data: "The email is not yet registered to an account"
        });
    }

    const checkPassword = await bcryptjs.compare(password, user.password);
    if (!checkPassword) {
        res.json({
            success: false,
            data: "The password does not match"
        });
    }
    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });

    res.header('auth-token', token).json({
        success: true,
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

    const emailExist = await User.findOne({
        email
    });
    
    if (emailExist) {
        res.json({
            success: false,
            data: "The Email already exists"
        });
    }
    try {
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
            success: true,
            isLogged: true,
            token,
            user
        });
        
    } catch (error) {
        console.log(error);
    }
   
});

router.get("/me", auth, async (req, res) => {
    res.json({
        success: true,
        data: req.user
    });
});
module.exports = router;