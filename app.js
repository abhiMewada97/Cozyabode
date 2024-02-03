const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

// MongoDB connection
main().then(()=>{
    console.log("connected to DB");
}) 
.catch((err)=>{
    console.log("not connect");
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
};

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res) =>{
    res.send("Hi I am root");
});

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

const validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(" , ");
        throw new ExpressError(400,errMsg);
    }else {
        next();
    }
}

// Index Route
app.get("/listings", wrapAsync( async (req,res) =>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

// New Route
app.get("/listings/new",(req,res)=> {
    res.render("listings/new.ejs");
});

// Show Route
app.get("/listings/:id", wrapAsync( async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}));

// Create Route
app.post("/listings",
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
app.get("/listings/:id/edit", wrapAsync( async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

// Update Route
app.put("/listings/:id", 
    validateListing,
    wrapAsync( async (req,res) =>{

    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});  // {...req.body.listing} js object which have all parameter and convert it into seperated value
    res.redirect(`/listings/${id}`);
}));

// Delete Route
app.delete("/listings/:id", wrapAsync( async (req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);  // when findByIdAndDelete call, so as a middleware listingSchema.post will inside listing.js
    console.log(deleteListing);
    res.redirect("/listings");
}));

// Reviews
// Post Reviews Route
app.post("/listings/:id/reviews", validateReview, wrapAsync( async (req,res) =>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));

// Delete Reviews Route
app.delete("/listings/:id/reviewss/:reviewId", wrapAsync( async (req,res)=>{
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

// app.get("/testListing",async (req,res) =>{
//     let sampleListing = new Listing({
        
//         title: "Secluded Beach House in Costa Rica",
//         description:
//         "Escape to a secluded beach house on the Pacific coast of Costa Rica. Surf, relax, and unwind.",    
//         price: 1800,
//         location: "Costa Rica",
//         country: "Costa Rica",
//     });
    
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("succesfull testing");
// });

app.all("*",(req,res,next) =>{
    next(new ExpressError(404,"Page Not Found!"));   // here we call next and next ke ander ek message pass karenge ( inside next we throw an express error we set "404" and "page not found")
});
// app.use catch the error

// Error handler
app.use((err,req,res,next) => {
    let {statusCode=500,message="Something went wrong!"} = err;
    res.status(statusCode).render("listings/error.ejs",{message});
    // res.status(statusCode).send(message); // status ko set ker denge statusCode se and send ker denge message ko
});

// app.use((err,req,res,next) =>{
//     res.send("Something went wrong");
// })

// Create server
app.listen(8080,(req,res) =>{
    console.log("Listing on port 8080");
});