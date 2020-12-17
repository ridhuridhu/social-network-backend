const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    username: {
        type: String
    },
    pic: {
        type: String
    },
    caption: {
        type: String
    },
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }],
    likesCount: {
        type: Number,
        default: 0
    },
    comments: [{
        text: {
            String
        },
        username: {
            String
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }
    }],
    date: {
        type: Date,
        default: Date.now,
    }


});

module.exports = mongoose.model('Post', postSchema);