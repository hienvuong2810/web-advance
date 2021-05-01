const express = require("express")
const app = express.Router()
const passport = require('passport');

require("../../utils/configPassport")

app.get("/login", (req, res)=>{
    let x = req.flash('error')
    // res.send('page login!'.concat(x))
    res.render('login')
})

//button login google 
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