const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const passport = require('passport');
const User = require('../models/user');
const { saveRedirectUrl } = require('../middleware.js');

const normalizeLoginIdentifier = async (req, res, next) => {
  const identifier = req.body.username || req.body.email;
  if (!identifier) return next();

  try {
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }]
    });

    if (user) {
      req.body.username = user.username;
    }
  } catch (err) {
    return next(err);
  }

  next();
};

// Signup
router.get('/signup', userController.renderSignupForm);
router.post('/signup', userController.signup);

// OTP Verification
router.get('/verify-otp', userController.renderVerifyOtp);
router.post('/verify-otp', userController.verifyOtp);
router.post('/resend-otp', userController.resendOtp);

// Login
router.get('/login', userController.renderLoginForm);
router.post(
  '/login',
  saveRedirectUrl,
  normalizeLoginIdentifier,
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  userController.login
);

// Logout
router.get('/logout', userController.logout);

module.exports = router;
