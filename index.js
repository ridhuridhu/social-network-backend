require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').Server(app);
const port = process.env.PORT || 5000;
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const MongoUrl = process.env.MONGO_URL;
const auth = require('./routes/auth');
const post = require("./routes/post");
const index = require("./routes/index");


app.use(cors());
app.use(express.json());

mongoose.connect(MongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
mongoose.connection
    .once('open', () => {
        console.log("Database in relationship with server");
    })
    .on('error', (err) => {
        console.log(err);
    });

app.use('/auth', auth);
app.use("/post", post);
app.use("/", index);


io.on('connnection', (socket) => {
    console.log("a user connected");





    socket.on('disconnect', () => {
        console.log("a user disconnected");
    });

});



http.listen(port, () => {
    console.log(`server on fire @${port}`);
});