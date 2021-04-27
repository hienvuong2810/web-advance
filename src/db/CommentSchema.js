const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    author : {type: Schema.Types.ObjectId, ref: 'Accounts'},
    content: String,
    createAt: Date,
    commentAt: {type: Schema.Types.ObjectId, ref: "Posts"},
})

let Comments = mongoose.model("Comment", CommentSchema, "Comments")
module.exports  = Comments