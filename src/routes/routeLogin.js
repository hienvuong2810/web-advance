const express = require("express")
const app = express.Router()
const passport = require('passport');
require("../../utils/configPassport")

app.get("/login", (req, res)=>{
    let x = req.flash('error')
    res.send('login!'.concat(x))
})

app.post("/register", (req, res)=>{
    // name department
    // username of department to log in
    // department : array contains all department
    const {name, username, password, department} = req.body

    
})




app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login', failureFlash: true}),
  function(req, res, info) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  }
);



app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/login');
})

module.exports = app