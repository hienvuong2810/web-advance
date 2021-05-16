const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Account = require("../src/db/AccountSchema")
passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: "83932345290-86g98vt5n8n3063r18s5mpvs34v71pgv.apps.googleusercontent.com",
    clientSecret: "xjGVTWUo8WgUTLuXyRdPJFq0",
    callbackURL: "https://tdtu-notify.herokuapp.com/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    if(profile._json.email.includes("@student.tdtu.edu.vn")){
       Account.findOne({username: profile._json.sub}, function(err, docs){
            console.log("1")
            if(err){
              return done(null, false, {message: "Lỗi server"})
            }
            if(docs){
              return done(null, docs)
            }
            Account.create({displayName: profile._json.name, avatar: profile._json.picture, username: profile._json.sub, role: 0, password: " ", department: null, class: " ", faculty: ""}, function(err, docs){
                if(!docs){
                  return done(null, false, {message: "Thêm thất bại"})
                }
                  return done(null, docs)
            })
       })

    }else{
      return done(null, false, {message:"Hãy dùng mail sinh viên"});
    }
    
  }
));