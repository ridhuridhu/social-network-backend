const express = require('express');
const router = express.Router();
const User = require("../models/User");




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

module.exports = router;