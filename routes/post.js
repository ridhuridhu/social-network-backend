const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require("../models/User");
const logged = require("../libs/auth");

router.get("/", async (req, res) => {
    const posts = await Post.find();

    res.json({
        success: true,
        data: posts
    });

});

router.get("/:id", async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.json({
            success: false,
            data: "no post found"
        });
    }

    res.json({
        success: true,
        data: post
    });

});


router.get("/delete/:id", logged, async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.json({
            success: false,
            data: " no post found"
        });
    }

    // const user=await User.findById(req.user.id);

    if (post.user == req.user.id) {
        await User.findByIdAndUpdate(req.user.id, {
            $pull: {
                posts: req.params.id
            },
            $inc: {
                postCount: -1
            },
        });
        await post.remove();

        res.json({
            success: true,
            data: {}
        });

    } else {
        res.json({
            success: false,
            data: "this post owns to someone else"
        });
    }


});

router.post("/add", logged, async (req, res) => {
    const {
        username,
        pic,
        caption
    } = req.body;
    const user = req.user.id;

    const post = await Post.create({
        user,
        username,
        pic,
        caption
    });

    await User.findByIdAndUpdate(req.user.id, {
        $push: {
            posts: post._id
        },
        $inc: {
            postCount: 1
        },
    });

    res.json({
        success: true,
        data: post
    });

});

router.get("/togglelike/:id", logged, async (req, res) => {
    const post = await Post.findById(req.params.id);


    if (!post) {
        res.json({
            success: false,
            data: "no post found"
        });
    }

    if (post.likes.includes(req.user.id)) {

        const index = post.likes.indexOf(req.user.id);
        post.likes.splice(index, 1);
        post.likesCount = -1;


    } else {
        post.likes.push(req.user.id);
        post.likesCount += 1;

    }

    await post.save();

    res.json({
        success: true,
        data: {}
    });
});


router.get('/addComment/:id', logged, async (req, res) => {

    const post = await Post.findById(req.params.id);

    if (!post) {
        res.json({
            success: false,
            data: "no Post found"
        });
    }

    let {
        text,
        username
    } = req.body;
    let user = req.user.id;

    let comment = ({
        text,
        username,
        user
    });
    post.comments.push(comment);
    await post.save();

    res.json({
        success: true,
        data: comment
    });

});

/*
router.get("/delComment/:id",logged,async(req,res)=>{

    const post = await Post.findById(req.params.id);

    if (!post) {
        res.json({
            success: false,
            data: "no Post found"
        });
    }

    let indexOfComment
});
*/
module.exports = router;