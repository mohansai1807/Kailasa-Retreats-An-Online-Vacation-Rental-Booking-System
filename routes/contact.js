const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact');
const { isLoggedIn } = require('../middleware.js');

router.get('/contact', isLoggedIn, contactController.renderContactForm);
router.post('/contact', isLoggedIn, contactController.submitContactForm);

module.exports = router;
