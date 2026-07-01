const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

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
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  userController.login
);

// Logout
router.get('/logout', userController.logout);

module.exports = router;
