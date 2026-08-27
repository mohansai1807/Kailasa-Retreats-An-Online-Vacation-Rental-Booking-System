const path = require("path");

require("dotenv").config({
    path: path.resolve(__dirname, "../.env"),
});

const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");



const getCategoryForTitle = (title) => {
    let t = title.toLowerCase();
    if (t.includes("beach")) return "Beachfront";
    if (t.includes("historic")) return "Historic";
    if (t.includes("cabin") || t.includes("cottage")) return "Cabins";
    if (t.includes("mountain") || t.includes("ski") || t.includes("chalet")) return "Mountains";
    if (t.includes("tropical") || t.includes("safari") || t.includes("oasis")) return "Tropical";
    if (t.includes("treehouse")) return "Treehouses";
    if (t.includes("villa")) return "Villas";
    if (t.includes("apartment") || t.includes("downtown") || t.includes("brownstone") || t.includes("penthouse") || t.includes("tokyo")) return "Iconic Cities";
    if (t.includes("lake")) return "Lakes";
    if (t.includes("island") || t.includes("maldives") || t.includes("bali") || t.includes("phuket")) return "Islands";
    return "Beachfront";
};

const Review = require("../models/review.js");
const User = require("../models/user.js");

const SAMPLE_GUEST_DATA = [
  { username: "Sarah_M", email: "sarah.m@example.com" },
  { username: "Alex_J", email: "alex.j@example.com" },
  { username: "Emily_R", email: "emily.r@example.com" },
  { username: "David_K", email: "david.k@example.com" },
  { username: "Priya_S", email: "priya.s@example.com" },
  { username: "Marcus_B", email: "marcus.b@example.com" }
];

const SAMPLE_REVIEWS = [
  { content: "Amazing place — would definitely stay here again!", rating: 5 },
  { content: "Very comfortable and clean. Great location with peaceful surroundings.", rating: 5 },
  { content: "Host was extremely responsive and helpful throughout our stay.", rating: 4 },
  { content: "Nice amenities, cozy atmosphere, and wonderful views.", rating: 5 },
  { content: "Good value for money. Clean, tidy, and highly recommended!", rating: 4 },
  { content: "Super clean, easy check-in, and great neighborhood.", rating: 5 },
  { content: "Loved every bit of our stay! Everything was spotless and well managed.", rating: 5 }
];

const cityCoords = {
    "Malibu": [-118.8050, 34.0259],
    "New York City": [-74.0060, 40.7128],
    "Aspen": [-106.8175, 39.1911],
    "Florence": [11.2558, 43.7696],
    "Portland": [-122.6784, 45.5152],
    "Cancun": [-86.8515, 21.1619],
    "Lake Tahoe": [-120.0324, 39.0968],
    "Los Angeles": [-118.2437, 34.0522],
    "Verbier": [7.2286, 46.0961],
    "Serengeti National Park": [34.8333, -2.1540],
    "Amsterdam": [4.9041, 52.3676],
    "Fiji": [178.0650, -17.7134],
    "Cotswolds": [-1.7207, 51.8330],
    "Boston": [-71.0589, 42.3601],
    "Bali": [115.1889, -8.4095],
    "Banff": [-115.5708, 51.1784],
    "Miami": [-80.1918, 25.7617],
    "Swiss Alps": [8.2275, 46.8182],
    "Tokyo": [139.6503, 35.6762],
    "Kyoto": [135.7681, 35.0116],
    "Phuket": [98.3923, 7.8804],
    "London": [-0.1278, 51.5074],
    "San Francisco": [-122.4194, 37.7749],
    "Santorini": [25.4324, 36.3932],
    "Amalfi Coast": [14.6027, 40.6340],
    "Prague": [14.4378, 50.0755],
    "Reykjavik": [-21.8174, 64.1265],
    "Sydney": [151.2093, -33.8688],
    "Dubai": [55.2708, 25.2048],
};

const initdb = async () => {
    const guestUsers = [];
    for (let guestData of SAMPLE_GUEST_DATA) {
        let user = await User.findOne({ username: guestData.username });
        if (!user) {
            user = new User({ email: guestData.email, username: guestData.username, isVerified: true });
            user = await User.register(user, "Password123!");
        }
        guestUsers.push(user);
    }

    const defaultOwner = guestUsers[0]._id;

    const data = initdata.data.map((obj) => {
        const coords = cityCoords[obj.location] || [77.2090, 28.6139];
        return {
            ...obj,
            category: getCategoryForTitle(obj.title),
            owner: defaultOwner,
            geometry: {
                type: "Point",
                coordinates: coords
            }
        };
    });
    await Listing.deleteMany({});
    await Review.deleteMany({});
    
    const createdListings = await Listing.insertMany(data);
    
    for (let listing of createdListings) {
        listing.reviews = [];
        const reviewCount = Math.floor(Math.random() * 2) + 3;
        for (let i = 0; i < reviewCount; i++) {
            const reviewSample = SAMPLE_REVIEWS[Math.floor(Math.random() * SAMPLE_REVIEWS.length)];
            const randomGuest = guestUsers[i % guestUsers.length];

            const review = new Review({
                content: reviewSample.content,
                rating: reviewSample.rating,
                author: randomGuest._id
            });
            await review.save();
            listing.reviews.push(review._id);
        }
        await listing.save();
    }
    console.log("Data & default guest reviews were initialized successfully");
};

async function main() {
  await mongoose.connect(process.env.ATLAS_URI);
  console.log("Connected to MongoDB Atlas");
  await initdb();
  await mongoose.connection.close();
}

main().catch(err => console.error(err));


