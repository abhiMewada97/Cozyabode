const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// creatring schema
const listingSchema = new Schema ({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default:
            "https://unsplash.com/photos/a-group-of-antelope-standing-in-the-desert-i60yUhfWeYI",
        
        // set: (v) => 
        //     v===""
        //     ? "https://unsplash.com/photos/a-group-of-antelope-standing-in-the-desert-i60yUhfWeYI"
        //     : v,

        set: (v) => 
           "https://unsplash.com/photos/a-group-of-antelope-standing-in-the-desert-i60yUhfWeYI"
            ,
    },
    price: Number,
    location: String,
    country: String,

    reviews: [
        {
            type: String,
        }
    ]
});

// creating model using above schema
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;