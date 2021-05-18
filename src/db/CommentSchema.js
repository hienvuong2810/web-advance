const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    author : {type: Schema.Types.ObjectId, ref: 'Accounts'},
    content: String,
    commentAt: {type: Schema.Types.ObjectId, ref: "Posts"},
},{
    timestamps: true
})

let Comments = mongoose.model("Comment", CommentSchema, "Comments")
module.exports  = Comments