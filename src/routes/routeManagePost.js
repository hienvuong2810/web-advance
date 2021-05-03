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
    if(req.files["image"] != undefined){
        req.files["image"].forEach(element => {
            arrImage.push(element.filename)
        });
    }
    //if author is student
    // if(req.user.role == 0 || req.sess.user.role == 0){
    let idAuthor = req?.user?._id ? req.user._id : req.session.user._id
    // if(req?.user?._id){
    //     idAuthor = req.user._id
    // }else{
    //     idAuthor = 
    // }
    console.log(req)
    Posts.create({
        author :idAuthor,
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

    // }else{
    //     return res.status(400).json({code: 400, msg: "Đăng bài thất bại"}) 
    // }
})

//update post
app.post("/updatePost", (req, res)=>{
    const {content, department} = req.body
    let arrImage = []
    if(req.files["image"] != undefined){
        req.files["image"].forEach(element => {
            arrImage.push(element.filename)
        });
    }
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
    console.log(req)
    
    let idAuthor = req?.user?._id ? req.user._id : req.session.user._id
    Post.findOneAndDelete(
        {
            _id: deleteId,
            author: idAuthor
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

//get post with page, default limit = 10
app.get("/getPost/:page",async (req, res)=>{
    const {page = 1, limit = 10} = req.params
    let result =  await Post.find({}).limit(limit * 1).skip((page - 1) * limit).populate("author").populate("comment")
    return res.status(200).json({code: 200, msg: result})
})

//get post of specific user
//id => id of user
app.get("/all/:id/:page", async (req, res)=>{
    const {id ,page = 1, limit = 10} = req.params
    let result =  await Post.find({author: id}).limit(limit * 1).skip((page - 1) * limit).populate("author").populate("comment")
    return res.status(200).json({code: 200, msg: result})
})

module.exports  = app