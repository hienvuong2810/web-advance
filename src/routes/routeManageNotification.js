const express = require("express")
const app = express.Router()
const Notification = require("../db/NotificationSchema")
const getDate = require("../../utils/date")

app.post("/add", (req, res)=>{
    const {department, content, title} = req.body

    if(req.user.role == 2){
        Notification.create(
            {
                author = req.user._id,
                department: department,
                title: title,
                content: content,
                createAt: getDate
            }, function (err, docs){
                if(err){
                    return res.status(500).json({code: 500, msg: "Lỗi server"})
                }else{

                    //socket

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
                createAt: getDate
            }, function (err, docs){
                if(err){
                    return res.status(500).json({code: 500, msg: "Lỗi server"})
                }else{

                    //socket

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






module.exports = app