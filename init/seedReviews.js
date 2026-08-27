const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const mongoose = require("mongoose");

const Listing = require("../models/listing");
const Review = require("../models/review");
const User = require("../models/user");

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

async function seedReviews() {
  const guestUsers = [];
  
  for (let guestData of SAMPLE_GUEST_DATA) {
    let user = await User.findOne({ username: guestData.username });
    if (!user) {
      user = new User({ email: guestData.email, username: guestData.username, isVerified: true });
      user = await User.register(user, "Password123!");
    }
    guestUsers.push(user);
  }

  // await Review.deleteMany({});

  const listings = await Listing.find({});

  console.log(`Found ${listings.length} listings`);

  for (const listing of listings) {
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
    console.log(`✔ Reviews added to ${listing.title}`);
  }

  console.log("🎉 Reviews seeded successfully with diverse guest users!");
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