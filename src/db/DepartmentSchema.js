const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DepartmentSchema = new Schema({
    name: String,
})

let Department = mongoose.model("Department", DepartmentSchema, "Departments")
module.exports  = Department