const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
    author : {type: Schema.Types.ObjectId, ref: 'Accounts'},
    content: String,
    createAt: {type : Date},
    files: Array,
    comment:[
        {type: Schema.Types.ObjectId, ref: 'Comment'}
    ],
    updateAt: {type: Date}
}, {
    timestamps: true
})

let Posts = mongoose.model("Post", PostSchema, "Posts")
module.exports  = Posts