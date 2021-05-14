const express = require('express')
const app = express.Router()
const Comment = require("../db/CommentSchema")
const Post = require("../db/PostSchema")
const getDate = require("../../utils/date")
app.post("/add", (req, res)=>{
    console.log(req.body)
    const {postId, content} = req.body
    console.log(postId, content)
    let idAuthor = req?.user?._id ? req.user._id : req.session.user._id
    Comment.create({author: idAuthor, content: content, createAt: getDate, commentAt: postId}, function(err, docs){
        if(docs){
            Post.findOneAndUpdate(
                {
                    _id: postId
                },
                {
                    $push: {
                        comment: docs._id
                    }
                },
                {
                    returnOriginal: false
                }, 
                (error, success) =>{
                    if(success){
                        return res.status(200).json({code: 200, msg: "Comment thành công", data: success})
                    }
                    return res.status(500).json({code: 500, msg: "Lỗi post " + error})
                    
            }).populate('author').populate({path: 'comment', populate: 'author'})
        }else {
            return res.status(500).json({code: 500, msg: "Lỗi comment"})
        }
    })
})


app.post("/update", (req, res)=>{
    const {commentId, contentUpdate} = req.body
    Comment.findOneAndUpdate(
        {
            _id: commentId,
            author: req.user._id
        },
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
    const idAuthor = req?.user?._id ? req.user._id : req.session.user._id;
    Comment.findOneAndDelete(
        {
            _id: commentId,
            author: idAuthor
        },
        function(err, docs){
            console.log(docs)
            if(docs){
                return res.status(200).json({code: 200, msg: "Xóa comment thành công"})
            }
            else if(err){
                return res.status(500).json({code: 500, msg: "Lỗi xóa " + err})
            }else{
                return res.status(200).json({code: 400, msg: "Lỗi xóa"})
            }            
        }
    )
})
module.exports = app