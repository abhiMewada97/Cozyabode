const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");      // parent route & inside listing.js is child route
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const user = require("./models/user.js");
const { read } = require("fs");

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

const sesssionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 *60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.get("/",(req,res) =>{
    res.send("Hi I am root");
});

app.use(session(sesssionOptions));
app.use(flash());  // we have use flash before route becuase routes use the flash

// here we are telling that we will use it
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));   // use static authenticate method of model in LocalStrategy  // when new user come it authenticate the use   // authenticate() Generates a function that is used in Passport's LocalStrategy

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());           // serializeUser() Generates a function that is used by Passport to serialize users into the session   // serialize means -> store the info related to user into session 
passport.deserializeUser(User.deserializeUser());       // deserializeUser() --//-- to deserialize --//--       


app.use((req,res,next) => {             // middleware
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// app.get("/demouser", async(req,res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");   // return new user    // register method of user save fakeuser automaticaly inside database with "helloworld" password; 
//     res.send(registeredUser);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

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