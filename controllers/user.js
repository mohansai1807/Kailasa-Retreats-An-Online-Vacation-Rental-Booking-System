const User = require('../models/user');
const bcrypt = require('bcrypt');
const { sendOtpEmail, sendWelcomeEmail, sendLoginSuccessEmail } = require('../utils/mailer');

// ─── Helpers ────────────────────────────────────────────────────────────────

// Generate a cryptographically simple 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Mask email for display: m***@gmail.com
const maskEmail = (email) => {
    const [user, domain] = email.split('@');
    return user.charAt(0) + '***@' + domain;
};

// ─── Signup ──────────────────────────────────────────────────────────────────

module.exports.renderSignupForm = (req, res) => {
    res.render('users/signup.ejs');
};

module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username, isVerified: true });
        const regUser = await User.register(newUser, password);

        req.session.otpEmail = null;
        req.session.otpUsername = null;
        req.session.pendingUserId = null;
        req.session.otpFlowType = null;
        req.session.redirectUrl = null;
        await new Promise((resolve, reject) => {
            req.session.save((err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        req.login(regUser, (err) => {
            if (err) return next(err);
            req.flash('success', `${username} created account successfully.`);
            return res.redirect('/listings');
        });
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/signup');
    }
};


// ─── OTP Verification ────────────────────────────────────────────────────────

module.exports.renderVerifyOtp = async (req, res, next) => {
    let email = req.session.otpEmail;
    if (!email && req.session.pendingUserId) {
        try {
            const pendingUser = await User.findById(req.session.pendingUserId);
            if (pendingUser) {
                email = pendingUser.email;
                req.session.otpEmail = email;
                req.session.otpUsername = pendingUser.username;
                await new Promise(resolve => req.session.save(resolve));
            }
        } catch (err) {
            return next(err);
        }
    }
    if (!email) {
        req.flash('error', 'Session expired. Please sign up again.');
        return res.redirect('/signup');
    }
    // flowType tells the view whether this OTP is for login or signup
    const flowType = req.session.otpFlowType || 'signup';
    res.render('users/verify-otp.ejs', { maskedEmail: maskEmail(email), pendingUserId: req.session.pendingUserId, flowType });
};

module.exports.verifyOtp = async (req, res, next) => {
    try {
        let email = req.session.otpEmail || req.body.otpEmail;
        const pendingUserId = req.body.pendingUserId || req.session.pendingUserId;
        if (!email && pendingUserId) {
            const pendingUser = await User.findById(pendingUserId);
            if (pendingUser) {
                email = pendingUser.email;
                req.session.otpEmail = email;
                req.session.otpUsername = pendingUser.username;
                req.session.pendingUserId = pendingUserId;
                await new Promise(resolve => req.session.save(resolve));
            }
        }
        if (!email) {
            req.flash('error', 'Session expired. Please sign up again.');
            return res.redirect('/signup');
        }

        // Collect OTP from either combined input or individual digit boxes
        const submittedOtp = (req.body.otp || '').toString().trim() ||
            ['d1','d2','d3','d4','d5','d6'].map(k => req.body[k] || '').join('').trim();

        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error', 'User not found. Please sign up again.');
            return res.redirect('/signup');
        }

        // Check expiry
        if (!user.otpExpiry || new Date() > user.otpExpiry) {
            req.flash('error', 'Your OTP has expired. Please request a new one.');
            return res.redirect('/verify-otp');
        }

        // Compare OTP
        const isMatch = await bcrypt.compare(submittedOtp, user.otp);
        if (!isMatch) {
            req.flash('error', 'Invalid OTP. Please try again.');
            return res.redirect('/verify-otp');
        }

        const isLoginFlow = req.session.otpFlowType === 'login';

        // Mark verified + clear OTP fields
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        // Send welcome or login success email in background (non-blocking)
        if (!isLoginFlow) {
            sendWelcomeEmail(user.email, user.username).catch(mailErr => {
                console.error('Welcome email failed:', mailErr.message);
            });
        } else {
            sendLoginSuccessEmail(user.email, user.username).catch(mailErr => {
                console.error('Login success email failed:', mailErr.message);
            });
        }

        if (isLoginFlow) {
            req.session.loginOtpVerified = true;
        }

        // Auto-login the user
        req.login(user, (err) => {
            if (err) return next(err);
            const redirectUrl = req.session.redirectUrl || '/listings';
            req.session.otpEmail = null;
            req.session.otpUsername = null;
            req.session.pendingUserId = null;
            req.session.redirectUrl = null;
            req.session.otpFlowType = null;
            req.session.loginOtpVerified = null;
            const successMsg = isLoginFlow
                ? `Welcome back, ${user.username}!`
                : `Welcome to Kailasa Retreats, ${user.username}! Your email is verified.`;
            req.flash('success', successMsg);
            res.redirect(redirectUrl);
        });
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/verify-otp');
    }
};

// ─── Resend OTP ───────────────────────────────────────────────────────────────

module.exports.resendOtp = async (req, res) => {
    try {
        const email = req.session.otpEmail;
        if (!email) {
            req.flash('error', 'Session expired. Please sign up again.');
            return res.redirect('/signup');
        }

        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error', 'User not found. Please sign up again.');
            return res.redirect('/signup');
        }

        // Generate fresh OTP
        const otp = generateOtp();
        const hashedOtp = await bcrypt.hash(otp, 10);
        user.otp = hashedOtp;
        user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        await user.save();

        console.log(`[OTP DEBUG] Generated Resend OTP for ${email}: ${otp}`);

        // Send OTP email in the background (non-blocking)
        sendOtpEmail(email, otp).catch(mailErr => {
            console.error('Resend OTP email failed — code:', mailErr.code, '| response:', mailErr.response, '| message:', mailErr.message);
        });

        req.flash('success', `A new OTP has been sent to ${maskEmail(email)}`);
        res.redirect('/verify-otp');
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/verify-otp');
    }
};

// ─── Login ────────────────────────────────────────────────────────────────────

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login.ejs');
};

module.exports.login = async (req, res, next) => {
    try {
        const user = req.user;

        // If the user's email is not yet verified, redirect them to complete OTP verification
        if (!user.isVerified) {
            req.session.otpEmail = user.email;
            req.session.otpUsername = user.username;
            req.session.pendingUserId = user._id;
            req.session.otpFlowType = 'signup';
            await new Promise((resolve, reject) => req.session.save(err => err ? reject(err) : resolve()));
            req.flash('error', 'Please verify your email first. A new OTP has been sent.');
            // Generate a fresh OTP so they are not stuck
            const otp = generateOtp();
            const hashedOtp = await bcrypt.hash(otp, 10);
            user.otp = hashedOtp;
            user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
            await user.save();

            console.log(`[OTP DEBUG] Generated Signup Prompt Login OTP for ${user.email}: ${otp}`);

            sendOtpEmail(user.email, otp).catch(e => console.error('Signup prompt OTP email failed:', e.message));
            return res.redirect('/verify-otp');
        }

        // Generate a fresh OTP for login and save it to the user record
        const otp = generateOtp();
        const hashedOtp = await bcrypt.hash(otp, 10);
        user.otp = hashedOtp;
        user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        await user.save();

        console.log(`[OTP DEBUG] Generated Login OTP for ${user.email}: ${otp}`);

        // Store email, pending user ID, redirect destination and flow type in session
        req.session.otpEmail = user.email;
        req.session.otpUsername = user.username;
        req.session.pendingUserId = user._id;
        req.session.otpFlowType = 'login';
        req.session.loginOtpVerified = false;
        await new Promise((resolve, reject) => {
            req.session.save((err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        // Send login OTP email in the background (non-blocking)
        sendOtpEmail(user.email, otp).catch(mailErr => {
            console.error('Login OTP email failed — code:', mailErr.code, '| response:', mailErr.response, '| message:', mailErr.message);
        });

        req.flash('success', `A login OTP has been sent to ${maskEmail(user.email)}`);
        return res.redirect('/verify-otp');
    } catch (err) {
        return next(err);
    }
};

// ─── Logout ───────────────────────────────────────────────────────────────────

module.exports.logout = (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.flash('success', 'User logged out successfully');
        res.redirect('/');
    });
};
