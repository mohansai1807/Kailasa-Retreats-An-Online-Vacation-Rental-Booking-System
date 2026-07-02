const path = require("path");

require("dotenv").config({
    path: path.resolve(__dirname, "../.env"),
});

const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");



async function main() {
  await mongoose.connect(process.env.ATLAS_URI);
  console.log("Connected to MongoDB Atlas");
}

main().then(() => {
    console.log("Database connection successful");
})
.catch(err => console.error(err));







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
    const data = initdata.data.map((obj) => {
        const coords = cityCoords[obj.location] || [77.2090, 28.6139];
        return {
            ...obj,
            owner: "6a45e368e6c8618325cad244",
            geometry: {
                type: "Point",
                coordinates: coords
            }
        };
    });
    await Listing.deleteMany({});
    await Listing.insertMany(data);
    console.log("Data was initialized successfully");
}

initdb();


