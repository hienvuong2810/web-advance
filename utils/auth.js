const isLoggedIn = (req, res, next) => {
    if(req.session.user){
        console.log("ADMIN or Department")
        req.user = req.session.user
    }
    if (req.user) {
        next();
    } else {
        res.redirect("/login");
    }
}

module.exports = isLoggedIn