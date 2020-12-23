const mongoose = require("mongoose");

const directSchema = new mongoose.Schema({

    users: [{
        id: {
            type: mongoose.Schema.ObjectId
        },
        username: {
            type: String
        }
    }],
    content: [{
        message: {
            type: String
        },
        time: {
            type: String
        },
        by: {
            type: mongoose.Schema.ObjectId
        }
    }],
    date: {
        type: String
    },




});


module.exports = mongoose.model("Direct", directSchema);