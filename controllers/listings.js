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

    const listing = await Listing.findById(id)
                                .populate({
                                    path: "reviews",
                                    populate: {
                                        path: "auther",
                                    },            
                                })                
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

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;     

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
    let deleteListing = await Listing.findByIdAndDelete(id);  
    console.log(deleteListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}