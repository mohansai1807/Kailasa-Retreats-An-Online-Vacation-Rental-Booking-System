const nodemailer = require('nodemailer');
const { otpTemplate, welcomeTemplate, queryAdminTemplate, queryConfirmTemplate } = require('./emailTemplates');

// Create Gmail SMTP transporter using App Password
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send OTP verification email
module.exports.sendOtpEmail = async (to, otp) => {
    await transporter.sendMail({
        from: `"Kailasa Retreats" <${process.env.EMAIL_USER}>`,
        to,
        subject: `${otp} is your Kailasa Retreats verification code`,
        html: otpTemplate(otp)
    });
};

// Send welcome email after OTP verified
module.exports.sendWelcomeEmail = async (to, username) => {
    await transporter.sendMail({
        from: `"Kailasa Retreats" <${process.env.EMAIL_USER}>`,
        to,
        subject: `Welcome to Kailasa Retreats, ${username}!`,
        html: welcomeTemplate(username)
    });
};

// Send query email to admin + auto-reply to sender
module.exports.sendQueryEmail = async ({ name, email, phone, subject, message }) => {
    // Email to admin
    await transporter.sendMail({
        from: `"Kailasa Retreats Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `New Query: ${subject}`,
        html: queryAdminTemplate({ name, email, phone, subject, message })
    });

    // Auto-reply to sender
    await transporter.sendMail({
        from: `"Kailasa Retreats" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `We received your query — ${subject}`,
        html: queryConfirmTemplate(name, subject)
    });
};
