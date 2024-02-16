const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res) => {
    res.render("users/signup.ejs");
}


module.exports.signup = async(req,res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({username, email});
        const registerdUser = await User.register(newUser, password);
        console.log(registerdUser);
        req.login(registerdUser, (err) =>{
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        })
    } catch (err) {
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs");
}

module.exports.login = async(req,res) => { 
    req.flash("success", "Welcome to Wanderlust! You are logged in!");
    // res.redirect("/listings");
    // res.redirect(req.session.redirectUrl);      // pasport by default reset req.session  // when login, login delete redirectUrl from req.session 
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);                    // pasport by default reset req.session  // when login, login delete redirectUrl from req.session 
}

module.exports.logout = (req,res) =>{
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    });
}

// module.exports. =

// module.exports. =

// module.exports. =

// module.exports. =

// module.exports. =

