const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NotifySchema = new Schema({
    author : {type: Schema.Types.ObjectId, ref: 'Account'},
    title: String,
    content: String,
    createAt: {type : Date, default : Date.now},
})

let Notification = mongoose.model("Notification", NotifySchema, "Notifications")
module.exports = Notification