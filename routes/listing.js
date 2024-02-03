const express = require("express");
const router = express.Router();      // create router object
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

// Validation Middleware
const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(" , ");
        throw new ExpressError(400,errMsg);
    }else {
        next();
    }
}

// Index Route
router.get("/", wrapAsync( async (req,res) =>{     //replace all app. --by-- router. // replace all "/listings" --by-- "/"
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

// New Route
router.get("/new",(req,res)=> {
    res.render("listings/new.ejs");
});

// Show Route
router.get("/:id", wrapAsync( async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}));

// Create Route
router.post("/",
    validateListing, 
    wrapAsync(async (req,res,next) =>{

        // let {title,description,price,location,country} = req.body;
        // let listing = req.body.listing;

        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    })
);

// Edit Route
router.get("/:id/edit", wrapAsync( async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

// Update Route
router.put("/:id", 
    validateListing,
    wrapAsync( async (req,res) =>{

    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});  // {...req.body.listing} js object which have all parameter and convert it into seperated value
    res.redirect(`/listings/${id}`);
}));

// Delete Route
router.delete("/listings/:id", wrapAsync( async (req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);  // when findByIdAndDelete call, so as a middleware listingSchema.post will inside listing.js
    console.log(deleteListing);
    res.redirect("/listings");
}));

module.exports = router;