const mongoose = require('mongoose');

const initdata = require("./data.js");

const Listing = require('../models/listing.js');


async function main() {
    await mongoose.connect('mongodb://localhost:27017/wunderlust');
    console.log("Connected to MongoDB");
}

main().then(() => {
    console.log("Database connection successful");
})
.catch(err => console.error(err));







const initdb = async () => {

    const data = initdata.data.map((obj) => ({
        ...obj,
        owner: "6a3bdc0f7dc8c7d256e6d66e"
    }));
    await Listing.deleteMany({});
    await Listing.insertMany(data);
}

initdb();


