const User = require('../models/user');
const { sendWelcomeEmail, sendLoginSuccessEmail } = require('../utils/mailer');

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
        req.session.loginOtpVerified = null;
        await new Promise((resolve, reject) => {
            req.session.save((err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        req.login(regUser, (err) => {
            if (err) return next(err);
            sendWelcomeEmail(regUser.email, regUser.username).catch(mailErr => {
                console.error('Welcome email failed:', mailErr.message);
            });
            req.flash('success', `${username} created account successfully.`);
            return res.redirect('/listings');
        });
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/signup');
    }
};


// ─── OTP Verification ────────────────────────────────────────────────────────

module.exports.renderVerifyOtp = (req, res) => {
    req.flash('error', 'Email verification is no longer required.');
    res.redirect('/login');
};

module.exports.verifyOtp = (req, res) => {
    req.flash('error', 'Email verification is no longer required.');
    res.redirect('/login');
};

module.exports.resendOtp = (req, res) => {
    req.flash('error', 'Email verification is no longer required.');
    res.redirect('/login');
};

// ─── Login ────────────────────────────────────────────────────────────────────

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login.ejs');
};

module.exports.login = async (req, res, next) => {
    try {
        const user = req.user;
        const redirectUrl = req.session.redirectUrl || '/listings';

        if (!user.isVerified) {
            user.isVerified = true;
            await user.save();
        }

        req.session.redirectUrl = null;
        req.session.otpEmail = null;
        req.session.otpUsername = null;
        req.session.pendingUserId = null;
        req.session.otpFlowType = null;
        req.session.loginOtpVerified = null;
        await new Promise((resolve, reject) => {
            req.session.save((err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        sendLoginSuccessEmail(user.email, user.username).catch(mailErr => {
            console.error('Login success email failed:', mailErr.message);
        });

        req.flash('success', `Welcome back, ${user.username}!`);
        return res.redirect(redirectUrl);
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
