const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking');
const { isLoggedIn } = require('../middleware.js');

// Show bookings for current user (or all bookings for admin)
router.get('/', isLoggedIn, bookingController.index);

module.exports = router;
