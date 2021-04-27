const express = require('express')
const app = express.Router()
const Comment = require("../db/CommentSchema")
const Post = require("../db/PostSchema")
const getDate = require("../../utils/date")
app.post("/add", (req, res)=>{
    const {postId, content} = req.body
    Comment.create({author: req.user._id, content: content, createAt: getDate, commentAt: postId}, function(err, docs){
        if(err){
            return res.status(500).json({code: 500, msg: "Lỗi comment"})
        }else{
            Post.findOneAndUpdate(
                {
                    _id: postId
                },
                {
                    $push: {
                        comment: docs._id
                    }
                }, function(err, success){
                    if(err){
                        return res.status(500).json({code: 500, msg: "Lỗi post " + err})
                    }else{
                        return res.status(200).json({code: 200, msg: "Comment thành công"})
                    }
                }
            )
        }
    })
})


app.post("/update", (req, res)=>{
    const {commentId, contentUpdate} = req.body
    Comment.findByIdAndUpdate(
        commentId,
        {
            content: contentUpdate
        }, function(err, docs){
            if(err){
                return res.status(500).json({code: 500, msg: "Lỗi comment " + err})
            }else{
                return res.status(200).json({code: 200, msg: "Cập nhật comment thành công"})
            }
        }
    )
})

app.post("/delete", (req, res)=>{
    const {commentId} = req.body

    Comment.findByIdAndDelete(
        {
            commentId
        },
        function(err, docs){
            if(err){
                return res.status(500).json({code: 500, msg: "Lỗi xóa " + err})
            }else{
                return res.status(200).json({code: 200, msg: "Xóa comment thành công"})
            }            
        }
    )
})
module.exports = app