const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middelware.js");


// Sign Up user
router.get("/signup", (req,res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req,res) => {
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
}));

// Login user
router.get("/login", (req,res) => {
    res.render("users/login.ejs");
});

// router.post("/login", passport.authenticate("local", {failureRedirect: '/login'}), async(req,res) => {    // stratigy-> "local"  // passport.authenticate() middleware use to authentaicate
router.post("/login", saveRedirectUrl, passport.authenticate("local", {failureRedirect: '/login', failureFlash: true }), async(req,res) => { 
        req.flash("success", "Welcome to Wanderlust! You are logged in!");
        // res.redirect("/listings");
        // res.redirect(req.session.redirectUrl);      // pasport by default reset req.session  // when login, login delete redirectUrl from req.session 
        let redirectUrl = res.locals.redirectUrl || "/listings"
        res.redirect(redirectUrl);                    // pasport by default reset req.session  // when login, login delete redirectUrl from req.session 
});

// Logout User
router.get("/logout", (req,res) =>{
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    });
});

module.exports = router;