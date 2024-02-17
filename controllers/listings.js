const Listing = require("../models/listing");

// Index
module.exports.index = async (req,res) =>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

// New
module.exports.renderNewForm = (req,res)=> {
    res.render("listings/new.ejs");
}

// show
module.exports.showListing = async (req,res) =>{
    let {id} = req.params;

    // const listing = await Listing.findById(id)                // here we are populating listing
    //                             .populate("reviews")          // listing ko populate karne ke sath sath authour ko bhi populate karege for each review -> for that we use nested populate
    //                             .populate("owner");           // nested populate means populating all reviews and their owner
    
    const listing = await Listing.findById(id)
                                .populate({
                                    path: "reviews",
                                    populate: {
                                        path: "auther",
                                    },            // here we populate authore with reviews // so for that we pass opbect in first populate and first parameter is "path"
                                })                // path me all review will come // and har ek review ke liye path me author aa jaye
                                .populate("owner");
    if(!listing) {
        req.flash("error","Listing you requested for, does not exit");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}

// Create
module.exports.createListing = async (req,res,next) =>{

    // let {title,description,price,location,country} = req.body;
    // let listing = req.body.listing;
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;     // we are saving information of current user inside,  owner inside newListing 
                                        // how to save info --> we know req object ke ander passport by default user related information store karta hai inside req.user and it has many diff diff value
    // console.log(req.user);
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

// Edit
module.exports.renderEditForm = async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error","Listing you requested for, does not exit");
        res.redirect("/listings");
    }
    let originamImageUrl = listing.image.url;
    originamImageUrl = originamImageUrl.replace("/upload", "/upload/w_250");         // clouding image transformations
    res.render("listings/edit.ejs",{listing, originamImageUrl});
}

// Update
module.exports.upddateListing = async (req,res) =>{

    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});  // {...req.body.listing} js object which have all parameter and convert it into seperated value
    
    if(typeof req.file !== "undefined") {

        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

// Delete
module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);  // when findByIdAndDelete call, so as a middleware listingSchema.post will inside listing.js
    console.log(deleteListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}