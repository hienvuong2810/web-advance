const express = require("express")
const app = express.Router()
const Account = require("../db/AccountSchema")
const bcrypt = require("bcrypt")
const multer = require('multer');

let storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "./images");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
});
app.use(multer({storage: storage}).fields([{name: "avatar", maxCount: 1 }]))

//register account for department
app.post("/register", (req, res)=>{
    // name department
    // username of department to log in
    // department : array contains all department
    const {name, username, password, department} = req.body
    Account.create({displayName: name, username: username, password: bcrypt.hashSync(password, 10), department: department, role: 2, avatar: "", class: "", faculty: ""  }, function(err, docs){
        if(err){
          return res.status(400).json({code: 400, msg: "Tạo tài khoản thất bại"})
        }else{
          return res.status(200).json({code: 200, msg: "Tạo tài khoản thành công"})
        }
    })
})


app.get("/update",(req, res)=>{
    console.log(req.user)
    if(req.user.role == 0){
      return res.send("student")
    } 
    if(req.user.role == 1){
      return res.send("ADMIN")
    }
    if(req.user.role == 2){
      return res.send("Department")
    }
    
})

//update account info student or department
app.post("/update",async (req, res)=> {
    // update student
    if(req.user.role == 1){
        const {nameUpdate, classUpdate, facultyUpdate} = req.body
        Account.findOneAndUpdate(
            {
                username: req.user.username
            },
            {
                displayName: nameUpdate,
                class: classUpdate,
                faculty: facultyUpdate,
                avatar: req.files['avatar'][0]
            }, function(err, docs){
                if(err){
                    return res.status(500).json({code: 500, msg: "Cập nhật thông tin thất bại"})
                }
                if(docs){
                    return res.status(200).json({code: 200, msg: "Cập nhật thông tin thành công"}) 
                }
            }
        )
    }else{
        // update for department
        const {oldPassword, newPassword} = req.body
        let result = await Account.findOne(
            {
                username : req.user.username,
            }
        )
        if(result && bcrypt.compareSync(oldPassword, result.password)){
            Account.findOneAndUpdate(
                {
                    username: req.user.username,
                },
                {
                    password: bcrypt.hashSync(newPassword, 10)
                }, function(err, docs){
                    if (err){
                        return res.status(500).json({code: 500, msg: "Cập nhật thông tin thất bại"})
                    }
                    if(docs){
                        return res.status(200).json({code: 200, msg: "Cập nhật thông tin thành công"}) 
                    }
                }
            )
        }else{
            return res.status(400).json({code: 400, msg: "Cập nhật thông tin thất bại"})
        }
    }
  



})


module.exports = app