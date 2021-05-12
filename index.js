const express = require("express")
const passport = require('passport');
const mongoose = require('mongoose')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('cookie-session')
const flash = require('connect-flash');
const app = express()
const hbs = require('express-handlebars')
app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'somesecret', 
    cookie: { maxAge: 60000 }}));

app.use("/images", express.static(__dirname + '/images'));
app.use("/public", express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function (socket) {
    console.log(socket.id + "connected");

});
app.set('socketio', io);
// app.set("view engine", "ejs");
// app.set("views", "./views");

app.engine('hbs', hbs({extname: 'hbs'}))
app.set('view engine', 'hbs');


const {auth} = require("./utils/auth")
const routeLogin = require("./src/routes/routeLogin")
const routeManageAccount = require("./src/routes/routeManageAccounts")
const routeManagePost = require("./src/routes/routeManagePost")
const routeComment = require("./src/routes/routeManageComment")
const routeNotification = require("./src/routes/routeManageNotification")
app.use("/manage", auth, routeManageAccount)
app.use("/comment", routeComment)
app.use("/post", routeManagePost)
app.use("/notification",routeNotification)
app.use("/", routeLogin)

app.get("/test", (req, res)=>{
    res.render("test")
})


mongoose.connect('mongodb://localhost:27017/Web', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});



http.listen(3000, (req, res)=>{
    console.log("Running http://localhost:3000")
})