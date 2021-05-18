const express = require("express")
const app = express.Router()
const Post = require("../db/PostSchema")
const multer = require('multer');
const Posts = require("../db/PostSchema");
const Comment = require('../db/CommentSchema')
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
    const {content, department, youtubeUrl} = req.body
    let arrImage = []
    if(req.files["image"] != undefined){
        req.files["image"].forEach(element => {
            arrImage.push(element.filename)
        });
    }
    let idAuthor = req?.user?._id ? req.user._id : req.session.user._id
    const ytbId = YouTubeGetID(youtubeUrl);
    Posts.create({
        author :idAuthor,
        content: youtubeUrl ? content + '---youtubebreakurl---' + ytbId : content,
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
    const {id, content, department, youtubeUrl} = req.body
    let arrImage = []
    if(req.files["image"] != undefined){
        req.files["image"].forEach(element => {
            arrImage.push(element.filename)
        });
    }
    const idAuthor = req?.user?._id ? req.user._id : req.session.user._id;
    const ytbId = YouTubeGetID(youtubeUrl);
    //if author is student
    Posts.findOneAndUpdate(
    {
        _id: id,
        author : idAuthor
    }, 
    {
        content: youtubeUrl ? content + '---youtubebreakurl---' + ytbId : content,
        updateAt: getDate,
        files: arrImage,
    }, function(err, docs){
        if (err){
            return res.status(500).json({code: 500, msg: "Chỉnh sửa bài thất bại"})
        }
        if(!docs){
            return res.status(400).json({code: 400, msg: "Chỉnh sửa bài thất bại"})
        }
        else{
            return res.status(200).json({code: 200, msg: "Chỉnh sửa bài thành công"})
        }
    })
})

function YouTubeGetID(url){
    url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
 }

//delete post
app.post("/deletePost", (req, res)=>{
    const {deleteId} = req.body
    
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
                Comment.deleteMany({commentAt: deleteId})
                return res.status(200).json({code: 200, msg: "Xóa bài thành công"})
            }
        }
    )
})

// Get specific of post by id
// id => id of post
app.get("/getDetailPost/:id", async (req, res) => {
    const {id} = req.params;
    const idAuthor  = req?.user?._id ? req.user._id : req.session.user._id;
    let result = await Post.findOne({_id: id, author: idAuthor});
    if(result){
        return res.status(200).json({code: 200, msg: result})
    }else{
        return res.status(400).json({code: 400, msg: 'Không thể chỉnh sửa Post'})
    }
});

//get post with page, default limit = 10
app.get("/getPost/:page",async (req, res)=>{
    const {page = 1, limit = 10} = req.params
    let result =  await Post.find({}).sort({createdAt: -1}).limit(limit * 1).skip((page - 1) * limit).populate("author").populate({path: "comment", populate: {path: 'author'}})
    return res.status(200).json({code: 200, msg: result})
})

//get post of specific user
//id => id of user
app.get("/all/:id/:page", async (req, res)=>{
    const {id ,page = 1, limit = 10} = req.params
    let result =  await Post.find({author: id}).sort({createdAt: -1}).limit(limit * 1).skip((page - 1) * limit).populate("author").populate({path: "comment", populate: {path: 'author'}})
    return res.status(200).json({code: 200, msg: result})
})

module.exports  = app