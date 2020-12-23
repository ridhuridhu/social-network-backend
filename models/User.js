const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    username: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    password: String,
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/douy56nkf/image/upload/v1594060920/defaults/txxeacnh3vanuhsemfc8.png",
    },
    bio: String,
    followers: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }],
    followersCount: {
        type: Number,
        default: 0,
    },
    followingCount: {
        type: Number,
        default: 0,
    },
    following: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }],
    posts: [{
        type: mongoose.Schema.ObjectId,
        ref: "Post"
    }],
    postCount: {
        type: Number,
        default: 0,
    },
    directId:[{
        type:mongoose.Schema.ObjectId
    }],





});

module.exports = mongoose.model("User", userSchema);