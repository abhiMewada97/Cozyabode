const express = require("express");
const router = express.Router();      // create router object
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middelware.js");
const listingController = require("../controllers/listings.js");        // using MVC framwork
const multer  = require("multer");
const {storage} = require("../cloudConfig.js");
// const upload = multer({ dest: 'uploads/' });                // store in uploads folder 
const upload = multer({ storage });                // now store in storage 

// Returns an instance of a single route which you can then use to handle HTTP verbs with optional middleware.
// Use router.route() to avoid duplicate route naming and thus typing errors.
//
router.route("/")
.get( wrapAsync( listingController.index))       // Index Route
.post( isLoggedIn, 
    upload.single('listing[image]'),        // Create Route //upload.single('listing[image]') middleware // multer process karega listing ke ander or image ke data ko or request.file me data lekar ayeg
    validateListing, 
    wrapAsync(listingController.createListing ));
// .post( upload.single('listing[image]'), (req,res) =>{
//     res.send(req.file); 
// }); 

//                              ^
//                              |  using router.route
// router.get("/", wrapAsync( listingController.index));       // Index Route            //replace all app. --by-- router. // replace all "/listings" --by-- "/"
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing ));;     // Create Route     

router.get("/new", isLoggedIn, listingController.renderNewForm)         // New Route

router.route("/:id")
.get( wrapAsync( listingController.showListing ))         // Show Route
.put( isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync( listingController.upddateListing))          // Update Route
.delete( isLoggedIn, isOwner, wrapAsync( listingController.destroyListing ));      // Delete Route

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync( listingController.renderEditForm));         // Edit Route

module.exports = router;