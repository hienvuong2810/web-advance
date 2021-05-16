const auth = (req, res, next) => {
    if(req.session.user){
        req.user = req.session.user;
    }
    if (req.user) {
        next();
    } else {
        res.redirect("/login");
    }
}

const authAdmin =  (req, res, next) => {
    if(req.session.user){
        req.user = req.session.user;
    }
    if(req.session.user.role == 1){
        next();
    }else{
        res.redirect("/login");
    }
}
const authDepartment =  (req, res, next) => {
    if(req.session.user){
        req.user = req.session.user;
    }
    if(req.session.user.role == 2){
        next();
    }else{
        res.redirect("/login");
    }
}

module.exports = {auth, authAdmin, authDepartment}