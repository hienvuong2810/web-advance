const express = require("express")
const app = express.Router()
const Notification = require("../db/NotificationSchema")
const Department = require("../db/DepartmentSchema")
const Account = require('../db/AccountSchema')
const {auth} = require('../../utils/auth');
const getDate = require("../../utils/date")

app.post("/add", auth, (req, res)=>{
    const {department, content, title} = req.body
    const io = req.app.get('socketio');

    if(req.user.role != 0){
        Notification.create(
            {
                author: req.user._id,
                department: department,
                title: title,
                content: content,
            }, function (err, docs){
                if(err){
                    return res.status(500).json({code: 500, msg: "Lỗi server"})
                }else{

                    let message = {user: req.user.displayName, data: docs}
                    io.emit("notification", message)

                    return res.status(200).json({code: 200, msg: "Thông báo thành công"})
                }
            }
        )
    }
})

app.post("/update", (req, res)=>{
    const {notificationId, content, title} = req.body

    if(req.user.role == 2){
        Notification.findByIdAndUpdate(
            notificationId,
            {
                title: title,
                content: content,
            }, function (err, docs){
                if(err){
                    return res.status(500).json({code: 500, msg: "Lỗi server"})
                }else{

                    io.emit("notification", req.user.displayName + "vừa sửa một thông báo: <a href="+">"+title+"</a>")

                    return res.status(200).json({code: 200, msg: "Cập nhật thông báo thành công"})
                }
            }
        )
    }
})

app.post("/delete", (req, res)=>{
    const {notificationId} = req.body

    Notification.findOneAndDelete(
        {
            _id: notificationId,
            author: req.user.id
        },function(err, docs){
            if(err){
                return res.status(500).json({code: 500, msg: "Lỗi server"})
            }
            if(!docs){
                return res.status(400).json({code: 400, msg: "Không tìm thấy thông báo"})
            }
            else{
                return res.status(200).json({code: 200, msg: "Xóa thông báo thành công"})
            }
        }
    )
})

//get notification with pagination
app.get("/list/notification/:page", async(req, res)=>{
    const {page = 1, limit = 10} = req.params;
    let result = await Notification.find().sort({createdAt: -1}).limit(limit * 1).skip((page - 1) * limit).populate('author').populate('department').select(["-__v"]);
    return res.status(200).json({code: 200, msg: result})
})


//get specific notification of department
// id => id of department
app.get("/list/department/:id",(req, res)=>{
    const {id} = req.params

    Notification.find({department: id}, function(err, docs){
        if(err){
            return res.status(500).json({code: 500, msg: "Lỗi server"})
        }
        else{
            return res.status(200).json({code: 200, msg: docs})
        }
    }).sort({createdAt: -1}).populate('author').populate('department')
    // res.json({tata: 'hello'})
})


/*
* get specific department by id
* id => id of department
*/

app.get("/specific/department/:id", (req, res) => {
    const {id} = req.params;
    Department.find({_id: id}, (err, docs) => {
        if(err){
            return res.status(500).json({code: 500, msg: 'Lỗi server'})
        }else{
            return res.status(200).json({code: 200, msg: docs[0]})
        }
    })
})


//get list department
app.get("/list/department",async (req, res)=>{
    let result = await Department.find()
    if(result){
        return res.status(200).json({code: 200, msg: result})
    }else{
        return res.status(400).json({code: 400, msg: "Không tìm thấy department"})
    }
})

//get specific notification
//id => id of notification
app.get("/:id",(req, res)=>{
    const {id} = req.params

    Notification.findById(id, function(err, docs){
        if(err){
            return res.status(500).json({code: 500, msg: "Lỗi server"})
        }
        else{
            return res.status(200).json({code: 200, msg: docs})
        }
    }).populate('author').populate('department')
})


app.get('/role-department/list', async (req, res) => {
    const role = req?.user?.role ? req.user.role : req.session.user.role
    const id = req?.user?._id ? req.user._id : req.session.user._id
    if(role == 1){
        let result = await Department.find()
        if(result){
            return res.status(200).json({code: 200, msg: result})
        }else{
            return res.status(400).json({code: 400, msg: "Không tìm thấy department"})
        }
    }else{
        let result = await Account.find({_id: id}).populate('department')
        if(result){
            return res.status(200).json({code: 200, msg: result[0].department})
        }else{
            return res.status(400).json({code: 400, msg: "Không tìm thấy department"})
        }
    }
})


module.exports = app