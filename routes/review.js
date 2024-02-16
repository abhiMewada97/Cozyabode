const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middelware.js");

const reviewController = require("../controllers/reviews.js");        // using MVC framwork

// Post Reviews Route
router.post("/", isLoggedIn, validateReview, wrapAsync( reviewController.createReview ));     // we have to take out all comon part from route --> "/listings/:id/reviews"

// Delete Reviews Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync( reviewController.destroyReview ));

module.exports = router;