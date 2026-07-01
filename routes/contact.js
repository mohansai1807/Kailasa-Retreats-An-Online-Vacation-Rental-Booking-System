const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact');

router.get('/contact', contactController.renderContactForm);
router.post('/contact', contactController.submitContactForm);

module.exports = router;
