const Listing = require('../models/listing');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');

module.exports.createReview = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      throw new ExpressError(404, 'Listing Not Found');
    }

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id; 
    await newReview.save();
    listing.reviews.push(newReview._id);
    await listing.save();

    console.log('New Review Saved');
    req.flash('success', 'New Review Created');
    res.redirect(`/listings/${req.params.id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteReview = async (req, res, next) => {
  try {
    console.log('DELETE ROUTE HIT');
    console.log(req.params);

    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }, { new: true });
    await Review.findByIdAndDelete(reviewId);

    console.log('Review Deleted');
    req.flash('success', 'Review Deleted Successfully');
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.log('ERROR:', err);
    next(err);
  }
};
