const express = require('express');
const router = express.Router({ mergeParams: true });
const bookingController = require('../controllers/booking');
const { isLoggedIn } = require('../middleware.js');

// Show booking form for a listing
router.get('/new', isLoggedIn, bookingController.new);

// Create booking for a listing
router.post('/', isLoggedIn, bookingController.create);

module.exports = router;
