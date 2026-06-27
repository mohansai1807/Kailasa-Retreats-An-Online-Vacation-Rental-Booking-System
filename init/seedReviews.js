const mongoose = require('mongoose');
const Listing = require('../models/listing');
const Review = require('../models/review');

const SAMPLE_REVIEWS = [
  'Amazing place — would stay again!',
  'Very comfortable and clean. Great location.',
  'Host was responsive and helpful.',
  'Nice amenities and pleasant stay.',
  'Good value for money, recommended.'
];

async function seed() {
  try {
    await mongoose.connect('mongodb://localhost:27017/wunderlust');
    console.log('Connected to MongoDB');

    const listings = await Listing.find({});
    console.log(`Found ${listings.length} listings`);

    for (const listing of listings) {
      const addCount = Math.floor(Math.random() * 2) + 3; // 2 or 3
      const createdIds = [];
      for (let i = 0; i < addCount; i++) {
        const content = SAMPLE_REVIEWS[Math.floor(Math.random() * SAMPLE_REVIEWS.length)];
        const rating = 4;
        const review = new Review({ content, rating });
        await review.save();
        listing.reviews.push(review._id);
        createdIds.push(review._id.toString());
      }
      await listing.save();
      console.log(`Listing ${listing._id}: added ${createdIds.length} reviews -> ${createdIds.join(', ')}`);
    }

    console.log('Seeding complete.');
  } catch (err) {
    console.error('Error seeding reviews:', err);
  } finally {
    await mongoose.connection.close();
  }
}

seed();
