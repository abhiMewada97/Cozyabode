const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req,res,next) => {
    // console.log(req);
    // console.log(req.path, " ... ", req.originalUrl);
    // console.log(req.user);

    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;                      // storing url inside session, because all methods and middleware have access of req.session so we can access redirectUrl
        // req.flash("error","you must be logged in to create listing!");
        req.flash("error","you must be logged!");
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

module.exports.isOwner = async (req,res,next) => {
    
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// Validation Middleware for listing
module.exports.validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(" , ");
        throw new ExpressError(400,errMsg);
    }else {
        next();
    }
}

// Validation Middleware for review
module.exports.validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(" , ");
        throw new ExpressError(400,errMsg);
    }else {
        next();
    }
}

module.exports.isReviewAuthor = async (req,res,next) => {
    
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.auther.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}