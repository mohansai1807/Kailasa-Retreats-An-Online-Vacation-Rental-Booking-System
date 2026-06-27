const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listing');
const { isLoggedIn, isOwner, isAdmin } = require('../middleware.js');
const multer = require("multer");

const {storage} = require("../cloudconfig.js")
const upload = multer({storage});

// Index Route (require login to browse listings from homepage)
router.get("/", isLoggedIn, listingController.index);

router.post("/", isLoggedIn, upload.single('listing[image]'), listingController.create);

// New Route (admin only)
router.get('/new', isLoggedIn, isAdmin, listingController.new);

// Create Route (admin only)
router.post('/', isLoggedIn, isAdmin, listingController.create);

// Show Route
router.get('/:id', listingController.show);

// Edit Route (admin only)
router.get('/:id/edit', isLoggedIn, isAdmin, listingController.edit);

// Update Route (admin only)
router.put('/:id', isLoggedIn, isAdmin, listingController.update);

// Delete Route (admin only)
router.delete('/:id', isLoggedIn, isAdmin, listingController.delete);

module.exports = router;
