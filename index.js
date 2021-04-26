const express = require("express")
const passport = require('passport');
const mongoose = require('mongoose')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieSession = require('cookie-session')
const flash = require('connect-flash');
const app = express()
app.use(cookieSession({  
    //maxAge: 24*60*60*1000,
    name: 'session',
    keys: ['key1', 'key2']
  }))
app.use("/images", express.static(__dirname + '/images'));
app.use("/views", express.static(__dirname + '/views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



const auth = require("./utils/auth")
const routeLogin = require("./src/routes/routeLogin")
const routeManageAccount = require("./src/routes/routeManageAccounts")
const routeManagePost = require("./src/routes/routeManagePost")

app.use("/manage", auth, routeManageAccount)
app.use("/post", routeManagePost)
app.use("/", routeLogin)



app.get('/dashboard', auth, (req, res) => res.send(`Welcome mr ${req.user.name}!`))


mongoose.connect('mongodb://localhost:27017/Web', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});



app.listen(3000, (req, res)=>{
    console.log("Running http://localhost:3000")
})