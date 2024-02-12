const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

// MongoDB connection
main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log("not connect");
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
};

// clear all data then insert new data of data.js file
const initDB = async ()=> {
    await Listing.deleteMany({});
    
    initData.data = initData.data.map( (obj) => (         // initData ko access karenga or ish array ko access karke map function apply kar denge or map har ek individual listing ke object ke sath ek new property ko add ker dega
        {...obj, owner: "65c75eed150841586f67fefe"}  // it not changes inside array balki ek new array create karta hai  // object pass uski property to hogi or sath me owner property bhi add ho jayegi
    )) 
    await Listing.insertMany(initData.data);     // initData is itself an object inside data.js we have access key data
    console.log("Data was initialized");
};

initDB();