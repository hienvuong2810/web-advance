const isLoggedIn = (req, res, next) => {
    if(req.session.user){
        req.user = req.session.user;
    }
    if (req.user) {
        next();
    } else {
        res.redirect("/login");
    }
}

module.exports = isLoggedIn