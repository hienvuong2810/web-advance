const express = require("express")
const app = express.Router()
const passport = require('passport');
const {auth, authAdmin, authDepartment} = require('../../utils/auth')
const authValidation = require('../validator/auth');
const {validationResult} = require("express-validator")
const Account = require('../db/AccountSchema');
const bcrypt = require("bcrypt")


require("../../utils/configPassport")


/*
*
* VIEW ROUTE
*
*/

app.get("/", auth, (req, res) => {
  if(req.user != undefined){
    switch (req.user.role) {
      case 0:
        return res.redirect('/dashboard')
      case 1:
        return res.redirect('/admin')
      case 2:
        return res.redirect('/department-dashboard')
    }
  }
  // res.send('page login!'.concat(x))
  res.redirect('/login');
})


app.get("/login", (req, res)=>{
    // let x = req.flash('error')
    //console.log('login',req)
    if(req.user != undefined){
      switch (req.user.role) {
        case 0:
          return res.redirect('/dashboard')
        case 1:
          return res.redirect('/admin')
        case 2:
          return res.redirect('/department-dashboard')
      }
    }
    else if(req.session.user){
      switch (req.session.user.role) {
        case 1:
          return res.redirect('/admin')
        case 2:
          return res.redirect('/department-dashboard')
      }
    }
    // res.send('page login!'.concat(x))
    res.render('login', {layout: false})
})

app.get('/dashboard', auth, (req, res) => {
  res.render('dashboard', {user: req.user});
})

app.get('/admin', authAdmin, (req,res) => {
  res.render('admin', {user: req.user});
})

app.get('/department-dashboard', authDepartment, (req,res) => {
  res.render('department', {user: req.user});
})

app.get('/all-notification', auth, (req,res) => {
  res.render('list-notification', {user: req.user});
})
app.get('/all-notification/:id', auth, (req,res) => {
  res.render('detail-notification', {user: req.user});
})

app.get('/by-department/:id', auth, (req,res) => {
  res.render('list-notification', {user: req.user});
})

app.get('/all-department', auth, (req,res) => {
  res.render('list-department', {user: req.user});
})




/*
*
* VIEW ROUTE END
*
*/





// Login
// , passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}) 
app.post('/login', authValidation, async (req, res) => {
  const result = validationResult(req);
  if (result.errors.length === 0){
    let {username, password } = req.body
    let query = await Account.findOne({username: username})
    if (query === null){
      return res.json({code: 500, msg: "Tài khoản không tồn tại"})
    }
    if (bcrypt.compareSync(password, query.password)){
      // let resClient =  User.findOne({username: req.username}).select(["-__v", "-password"])
      // return res.json({code: 200, msg: "Đăng nhập thành công", user: resClient})
          req.session.user = query
      return res.json({code: 200, msg: "Đăng nhập thành công"})
    }else{
      return res.json({code: 500, msg: "Sai mật khẩu"})
    }
}
else{ 
  return res.json({
    code: 500,
    msg: result?.errors[0].msg
  })
}
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