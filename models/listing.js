const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Review = require("./review.js");

const DEFAULT_IMAGE =
    "https://images.unsplash.com/photo-1551573355-19727699d60a?ixlib=rb-1.2.1&w=1000&q=80";

const listingSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
    },

    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
    },

    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
            default: DEFAULT_IMAGE
        }
    },

    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"],
    },

    location: {
        type: String,
        trim: true,
    },

    country: {
        type: String,
        trim: true,
    },

    category: {
        type: String,
        enum: ["Trending", "Beachfront", "Historic", "Cabins", "Mountains", "Tropical", "Treehouses", "Villas", "Iconic Cities", "Lakes", "Islands"]
    },

    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },

    reviews: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Review"
        }],
        default: []
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

listingSchema.post("findOneAndDelete", async function (listing) {
    if (!listing || !Array.isArray(listing.reviews) || listing.reviews.length === 0) {
        return;
    }

    await Review.deleteMany({
        _id: { $in: listing.reviews }
    });
});

module.exports = mongoose.model("Listing", listingSchema);
