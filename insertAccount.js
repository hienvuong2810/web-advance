const bcrypt = require('bcrypt');
const Account = require('./src/db/AccountSchema')

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Web', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const admin = new Account({
    username: 'admin',
    password: bcrypt.hashSync('admin', 10),
    role: 1,
    avatar: "https://www.w3schools.com/howto/img_avatar.png",
    displayName: 'Admin',
})


admin.save();