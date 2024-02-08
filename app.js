const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");


const listings = require("./routes/listing.js");      // parent route & inside listing.js is child route
const reviews = require("./routes/review.js");

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

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

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

// Create server
app.listen(8080,(req,res) =>{
    console.log("Listing on port 8080");
});