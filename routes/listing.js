const express = require("express");
const router = express.Router(); 
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middelware.js");
const listingController = require("../controllers/listings.js");        // using MVC framwork
const multer  = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

// Returns an instance of a single route which you can then use to handle HTTP verbs with optional middleware.
// Use router.route() to avoid duplicate route naming and thus typing errors.
//
router.route("/")
.get( wrapAsync( listingController.index))
.post( isLoggedIn, 
    upload.single('listing[image]'),
    validateListing, 
    wrapAsync(listingController.createListing )
    );
// .post( upload.single('listing[image]'), (req,res) =>{
//     res.send(req.file);
// });

router.get("/new", isLoggedIn, listingController.renderNewForm)         // New Route

router.route("/:id")
.get( wrapAsync( listingController.showListing ))         // Show Route
.put( isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync( listingController.upddateListing))          // Update Route
.delete( isLoggedIn, isOwner, wrapAsync( listingController.destroyListing ));      // Delete Route

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync( listingController.renderEditForm));         // Edit Route

module.exports = router;