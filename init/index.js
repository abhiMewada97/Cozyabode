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
    await Listing.insertMany(initData.data);     // initData is itself an object inside data.js we have access key data
    console.log("Data was initialized");
};

initDB();