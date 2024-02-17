const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middelware.js");

const userController = require("../controllers/users.js");

// Sign Up user
router.route("/signup")
.get( userController.renderSignupForm)
.post( wrapAsync( userController.signup ));

// Login user
router.route("/login")
.get( userController.renderLoginForm)
.post( saveRedirectUrl, passport.authenticate("local", {failureRedirect: '/login', failureFlash: true }), userController.login );    // stratigy-> "local"  // passport.authenticate() middleware use to authentaicate

// Logout User
router.get("/logout", userController.logout);

module.exports = router;