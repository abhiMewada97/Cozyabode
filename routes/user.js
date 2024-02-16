const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middelware.js");

const userController = require("../controllers/users.js");

// Sign Up user
router.get("/signup", userController.renderSignupForm);

router.post("/signup", wrapAsync( userController.signup ));

// Login user
router.get("/login", userController.renderLoginForm);

router.post("/login", saveRedirectUrl, passport.authenticate("local", {failureRedirect: '/login', failureFlash: true }), );    // stratigy-> "local"  // passport.authenticate() middleware use to authentaicate

// Logout User
router.get("/logout", userController.logout);

module.exports = router;