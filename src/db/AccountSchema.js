const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AccountSchema = new Schema({
    displayName: String,
    password: String,
    // password for Admin or Department
    username: String,
    // or googleID when is student
    // username for admin or department
    role: Number,
    // role == 0 : Student
    // role == 1 : ADMIN
    // role == 2 : Department
    department: Array,
    // list department of user (only role == 2)
    avatar: String,
    class: String,
    //class for student
    faculty: String,
    // faculty for Student
})

let Accounts = mongoose.model("Accounts", AccountSchema, "Accounts")
module.exports  = Accounts