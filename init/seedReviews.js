const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const mongoose = require("mongoose");

const Listing = require("../models/listing");
const Review = require("../models/review");
const User = require("../models/user");

const SAMPLE_REVIEWS = [
  "Amazing place — would stay again!",
  "Very comfortable and clean. Great location.",
  "Host was responsive and helpful.",
  "Nice amenities and pleasant stay.",
  "Good value for money, recommended."
];

async function seedReviews() {

  const admin = await User.findOne();

  if (!admin) {
    throw new Error("No users found. Please signup first.");
  }

  await Review.deleteMany({});

  const listings = await Listing.find({});

  console.log(`Found ${listings.length} listings`);

  for (const listing of listings) {

    listing.reviews = [];

    const reviewCount = Math.floor(Math.random() * 2) + 3;

    for (let i = 0; i < reviewCount; i++) {

      const review = new Review({

        content:
          SAMPLE_REVIEWS[
            Math.floor(Math.random() * SAMPLE_REVIEWS.length)
          ],

        rating: Math.floor(Math.random() * 2) + 4,

        author: admin._id

      });

      await review.save();

      listing.reviews.push(review._id);

    }

    await listing.save();

    console.log(`✔ Reviews added to ${listing.title}`);

  }

  console.log("🎉 Reviews seeded successfully");

}

async function main() {

  try {

    await mongoose.connect(process.env.ATLAS_URI);

    console.log("✅ Connected to MongoDB Atlas");

    await seedReviews();

  } catch (err) {

    console.log(err);

  } finally {

    await mongoose.connection.close();

    console.log("MongoDB connection closed");

  }

}

main();