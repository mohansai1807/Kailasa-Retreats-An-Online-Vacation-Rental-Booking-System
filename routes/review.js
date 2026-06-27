const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewController = require('../controllers/review');
const { isLoggedIn, isAuthor, validateReview } = require('../middleware.js');

// Create Review
router.post('/', validateReview, isLoggedIn, reviewController.createReview);

// Delete Review
router.delete('/:reviewId', isLoggedIn, isAuthor, reviewController.deleteReview);

module.exports = router;
