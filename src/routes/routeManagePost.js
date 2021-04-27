const express = require("express")
const app = express.Router()
const Post = require("../db/PostSchema")
const multer = require('multer');
const Posts = require("../db/PostSchema");
const getDate = require("../../utils/date")
let storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "./images");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + (file.originalname)) //Appending extension
    }
});
app.use(multer({storage: storage}).fields([{name: "image", maxCount: 1 }]))

//create post
app.post("/createPost",async (req, res)=> {
    const {content, department} = req.body
    let arrImage = []
    req.files["image"].forEach(element => {
        arrImage.push(element.filename)
    });
    //if author is student
    if(req.user.role == 0){
        Posts.create({
            author : req.user._id,
            content: content,
            createAt: getDate,
            files: arrImage,
            department: "",
            comment:  []
        }, function(err, docs){
            if (err){
                return res.status(500).json({code: 500, msg: "Đăng bài thất bại"})
            }else{
                return res.status(200).json({code: 200, msg: "Đăng bài thành công"})
            }
        })
    }else{
        return res.status(400).json({code: 400, msg: "Đăng bài thất bại"}) 
    }
})

//update post
app.post("/updatePost", (req, res)=>{
    const {content, department} = req.body
    let arrImage = []
    req.files["image"].forEach(element => {
        arrImage.push(element.filename)
    });
    //if author is student
    if(req.user.role == 0){
        Posts.findOneAndUpdate(
        {
            author : req.user._id
        }, 
        {
            author : req.user._id,
            content: content,
            createAt: getDate,
            files: arrImage,
            department: undefined,
            comment:  []
        }, function(err, docs){
            if (err){
                return res.status(500).json({code: 500, msg: "Đăng bài thất bại"})
            }
            if(!docs){
                return res.status(400).json({code: 400, msg: "Đăng bài thất bại"})
            }
            else{
                return res.status(200).json({code: 200, msg: "Đăng bài thành công"})
            }
        })
    }else{
        return res.status(400).json({code: 400, msg: "Đăng bài thất bại (not a user)"})
    }
})

//delete post
app.post("/deletePost", (req, res)=>{
    const {deleteId} = req.body
    Post.findOneAndDelete(
        {
            _id: deleteId,
            author: req.user._id
        },function(err, docs){
            if (err){
                return res.status(500).json({code: 500, msg: "Xóa bài thất bại" + err})
            }
            if(!docs){
                return res.status(400).json({code: 400, msg: "Xóa bài thất bại"})
            }
            else{
                return res.status(200).json({code: 200, msg: "Xóa bài thành công"})
            }
        }
    )
})


app.get("/getPost",async (req, res)=>{
    let result =  await Post.find({}).populate("author").populate("comment")
    return res.status(200).json({code: 200, msg: result})
})


module.exports  = app