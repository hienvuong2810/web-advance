const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    author : {type: Schema.Types.ObjectId, ref: 'Account'},
    content: String,
    createAt: Date,
    commentAt: {type: Schema.Types.ObjectId, ref: "Post"},
})

let Comments = mongoose.Model("Comment", CommentSchema, "Comments")
module.exports  = Comments