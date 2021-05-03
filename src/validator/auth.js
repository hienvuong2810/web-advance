const {check} = require("express-validator")

module.exports = [
    check("username")
    .exists().withMessage('Vui lòng nhập username')
    .notEmpty().withMessage('Username không được để trống'),

    check("password")
    .exists().withMessage("Vui lòng nhập mật khẩu")
    .notEmpty().withMessage("Không để trống mật khẩu")
]