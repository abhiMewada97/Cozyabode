const express = require("express");
const router = express.Router();      // create router object
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middelware.js");

const listingController = require("../controllers/listings.js");        // using MVC framwork

// Index Route
router.get("/", wrapAsync( listingController.index));     //replace all app. --by-- router. // replace all "/listings" --by-- "/"

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show Route
router.get("/:id", wrapAsync( listingController.showListing ));

// Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing)
);

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync( listingController.renderEditForm));

// Update Route
router.put("/:id", isLoggedIn, 
    isOwner,
    validateListing,
    wrapAsync( listingController.upddateListing));

// Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync( listingController.destroyListing ));

module.exports = router;