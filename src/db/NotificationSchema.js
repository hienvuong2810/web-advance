const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NotifySchema = new Schema({
    author : {type: Schema.Types.ObjectId, ref: 'Accounts'},
    department: {type: Schema.Types.ObjectId, ref: 'Departments'},
    title: String,
    content: String,
    createAt: {type : Date},
})

let Notification = mongoose.model("Notification", NotifySchema, "Notifications")
module.exports = Notification