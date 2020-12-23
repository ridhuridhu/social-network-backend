const express = require('express');
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const logged = require("../libs/auth");

router.get("/", async (req, res) => {
    const post = await Post.find();

    res.json({
        success: true,
        data: post
    });
});

router.get("/profile/:id", async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.json({
            success: false,
            data: 'no such user exist'
        });
    }

    res.json({
        success: true,
        data: user
    });

});


router.get("/search/:text", async (req, res) => {
    let list = [];

    const users = await User.find();

    users.map((user) => {
        if ((user.username).includes(req.params.text)) {
            list.push(user);
        }
    });

    res.json({
        success: true,
        data: list
    });



});

router.get("/follow/:id", logged, async (req, res) => {

    const user = await User.findById(req.params.id);
    if (!user) {
        res.json({
            success: false,
            data: "No such user found"
        });
    }

    if (user._id === req.user.id) {
        res.json({
            success: false,
            data: "you can't follow/unfollow yourself"
        });
    }

    await User.findByIdAndUpdate(req.params.id, {
        $push: {
            followers: req.user.id
        },
        $inc: {
            followersCount: 1
        },
    });
    await User.findByIdAndUpdate(req.user.id, {
        $push: {
            following: req.params.id
        },
        $inc: {
            followingCount: 1
        },
    });


    res.json({
        success: true
    });


});


router.get("/unfollow/:id", logged, async (req, res) => {

    const user = await User.findById(req.params.id);
    if (!user) {
        res.json({
            success: false,
            data: "No such user found"
        });
    }

    if (user._id === req.user.id) {
        res.json({
            success: false,
            data: "you can't follow/unfollow yourself"
        });
    }

    await User.findByIdAndUpdate(req.params.id, {
        $pull: {
            followers: req.user.id
        },
        $inc: {
            followersCount: -1
        },
    });
    await User.findByIdAndUpdate(req.user.id, {
        $pull: {
            following: req.params.id
        },
        $inc: {
            followingCount: -1
        },
    });


    res.json({
        success: true
    });


});


router.get("/following", logged, async (req, res) => {
    console.log("s");
    let userFollowing = [];

    let user = await User.findById(req.user.id);
    if (!user) {
        res.json({
            success: false,
            data: "no such user found!"
        });
    }

    const pushUserData=async(id)=>{
        let followingUser= await User.findById(id);
        console.log(followingUser);
        userFollowing.push(followingUser);
        console.log(userFollowing);
    };

    (user.following).map(i=>{
        console.log(i);
        pushUserData(i);
    });
    
    res.json({
        success:true,
        data:userFollowing
    });


});
module.exports = router;