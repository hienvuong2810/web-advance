const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
    author : {type: Schema.Types.ObjectId, ref: 'Account'},
    content: String,
    createAt: {type : Date, default : Date.now},
    files: Array,
    comment:[
        {type: Schema.Types.ObjectId, ref: 'Comment'}
    ]
})

let Posts = mongoose.model("Post", PostSchema, "Posts")
module.exports  = Posts