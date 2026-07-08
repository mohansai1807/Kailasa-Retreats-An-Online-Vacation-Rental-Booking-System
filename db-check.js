require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');

async function main() {
    await mongoose.connect(process.env.ATLAS_URI);
    const listings = await Listing.find({});
    for (let l of listings) {
        console.log(`ID: ${l._id} | Title: ${l.title} | Category: ${l.category || 'none'}`);
    }
    mongoose.connection.close();
}

main().catch(err => console.log(err));
