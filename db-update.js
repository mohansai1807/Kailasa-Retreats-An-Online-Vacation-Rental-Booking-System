require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');

const categories = ["Trending", "Beachfront", "Historic", "Cabins", "Mountains", "Tropical", "Treehouses", "Villas", "Iconic Cities", "Lakes", "Islands"];

async function main() {
    await mongoose.connect(process.env.ATLAS_URI);
    const listings = await Listing.find({});
    
    for (let l of listings) {
        let title = l.title.toLowerCase();
        let category = "Trending"; // Default

        if (title.includes("beach")) category = "Beachfront";
        else if (title.includes("historic")) category = "Historic";
        else if (title.includes("cabin") || title.includes("cottage")) category = "Cabins";
        else if (title.includes("mountain") || title.includes("ski")) category = "Mountains";
        else if (title.includes("tropical") || title.includes("safari") || title.includes("oasis")) category = "Tropical";
        else if (title.includes("treehouse")) category = "Treehouses";
        else if (title.includes("villa")) category = "Villas";
        else if (title.includes("apartment") || title.includes("downtown") || title.includes("brownstone") || title.includes("penthouse") || title.includes("tokyo")) category = "Iconic Cities";
        else if (title.includes("lake")) category = "Lakes";
        else if (title.includes("island") || title.includes("maldives") || title.includes("bali") || title.includes("phuket")) category = "Islands";
        else category = "Trending";

        l.category = category;
        await l.save();
        console.log(`Updated "${l.title}" to ${category}`);
    }
    
    mongoose.connection.close();
}

main().catch(err => console.log(err));
