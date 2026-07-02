const nodemailer = require('nodemailer');
const { otpTemplate, welcomeTemplate, queryAdminTemplate, queryConfirmTemplate } = require('./emailTemplates');

// Create transporter lazily so env vars are always read fresh
const createTransporter = () => {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
        throw new Error(`Email env vars missing: EMAIL_USER=${user ? 'set' : 'MISSING'}, EMAIL_PASS=${pass ? 'set' : 'MISSING'}`);
    }

    return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,        // Use port 465 with SSL (more reliable than 587+STARTTLS on cloud hosts)
        secure: true,     // true for 465
        auth: { user, pass },
        connectionTimeout: 30000,
        greetingTimeout: 30000,
        socketTimeout: 30000
    });
};

// Send OTP verification email
module.exports.sendOtpEmail = async (to, otp) => {
    const transporter = createTransporter();
    await transporter.sendMail({
        from: `"Kailasa Retreats" <${process.env.EMAIL_USER}>`,
        to,
        subject: `${otp} is your Kailasa Retreats verification code`,
        html: otpTemplate(otp)
    });
};

// Send welcome email after OTP verified
module.exports.sendWelcomeEmail = async (to, username) => {
    const transporter = createTransporter();
    await transporter.sendMail({
        from: `"Kailasa Retreats" <${process.env.EMAIL_USER}>`,
        to,
        subject: `Welcome to Kailasa Retreats, ${username}!`,
        html: welcomeTemplate(username)
    });
};

// Send query email to admin + auto-reply to sender
module.exports.sendQueryEmail = async ({ name, email, phone, subject, message }) => {
    const transporter = createTransporter();

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
