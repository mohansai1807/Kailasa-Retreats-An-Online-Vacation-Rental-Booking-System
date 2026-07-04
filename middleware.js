const Listing = require('./models/listing');
const Review = require('./models/review');
const { reviewSchema } = require('./script.js');
const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash('error', 'Please login first!');
    return res.redirect('/login');
  }

  // Block access if email is not yet verified
  if (!req.user.isVerified) {
    req.session.redirectUrl = req.originalUrl;
    req.flash('error', 'Please verify your email before continuing.');
    return res.redirect('/verify-otp');
  }

  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }

  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash('error', "you don't have access to edit because you are not the owner");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

module.exports.isAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash('error', "you don't have access to edit because you are not the author");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isAdmin = (req, res, next) => {
  // Allow only the specific username 'mohanasai' as admin
  if (!req.isAuthenticated() || !req.user || req.user.username !== 'mohanasai') {
    req.flash('error', 'You do not have permission to perform this action');
    return res.redirect('/listings');
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const errMsg = error.details.map(el => el.message).join(',');
    throw new ExpressError(400, errMsg);
  }

  next();
};
