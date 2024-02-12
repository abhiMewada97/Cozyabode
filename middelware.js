module.exports.isLoggedIn = (req,res,next) => {
    // console.log(req);
    // console.log(req.path, " ... ", req.originalUrl);
    // console.log(req.user);

    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;                      // storing url inside session, because all methods and middleware have access of req.session so we can access redirectUrl
        req.flash("error","you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}