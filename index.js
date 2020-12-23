require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').Server(app);
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const MongoUrl = process.env.MONGO_URL;
const auth = require('./routes/auth');
const post = require("./routes/post");
const index = require("./routes/index");
const User = require("./models/User");
const Direct = require("./models/Direct");
const formatDate = require('./libs/date');

app.use(cors());
app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

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


const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});


io.on('connection', function (socket) {
    console.log('a user connected');



    //instead of mes
    socket.on("message", (data) => {
        console.log(data);

        let d=formatDate(data);
        console.log(d.time,d.date);
        
        io.sockets.emit("message", data);
    });

    socket.on('disconnect', function () {

        console.log('user disconnected');
    });


    socket.on('example_message', function (msg) {
        console.log('message: ' + msg);
    });
});


http.listen(port, () => {
    console.log(`server on fire @${port}`);
});