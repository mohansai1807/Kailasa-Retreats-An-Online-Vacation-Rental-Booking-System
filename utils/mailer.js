const { Resend } = require('resend');
const { otpTemplate, welcomeTemplate, queryAdminTemplate, queryConfirmTemplate } = require('./emailTemplates');

// ──────────────────────────────────────────────────────────────────────────────
// Resend client (reads API key fresh each call in case of hot-reload)
// ──────────────────────────────────────────────────────────────────────────────
const getClient = () => {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error('RESEND_API_KEY environment variable is not set');
    return new Resend(key);
};

const FROM_ADDRESS = process.env.EMAIL_FROM || `Kailasa Retreats <onboarding@resend.dev>`;
const ADMIN_EMAIL  = process.env.ADMIN_EMAIL  || process.env.EMAIL_USER;

// ──────────────────────────────────────────────────────────────────────────────
// Send OTP verification email
// ──────────────────────────────────────────────────────────────────────────────
module.exports.sendOtpEmail = async (to, otp) => {
    const resend = getClient();
    const { error } = await resend.emails.send({
        from: FROM_ADDRESS,
        to,
        subject: `${otp} is your Kailasa Retreats verification code`,
        html: otpTemplate(otp)
    });
    if (error) throw new Error(`Resend OTP error: ${error.message}`);
};

// ──────────────────────────────────────────────────────────────────────────────
// Send welcome email after OTP verified
// ──────────────────────────────────────────────────────────────────────────────
module.exports.sendWelcomeEmail = async (to, username) => {
    const resend = getClient();
    const { error } = await resend.emails.send({
        from: FROM_ADDRESS,
        to,
        subject: `Welcome to Kailasa Retreats, ${username}!`,
        html: welcomeTemplate(username)
    });
    if (error) throw new Error(`Resend welcome error: ${error.message}`);
};

// ──────────────────────────────────────────────────────────────────────────────
// Send query email to admin + auto-reply to sender
// ──────────────────────────────────────────────────────────────────────────────
module.exports.sendQueryEmail = async ({ name, email, phone, subject, message }) => {
    const resend = getClient();

    // Email to admin
    const { error: adminErr } = await resend.emails.send({
        from: FROM_ADDRESS,
        to: ADMIN_EMAIL,
        subject: `New Query: ${subject}`,
        html: queryAdminTemplate({ name, email, phone, subject, message })
    });
    if (adminErr) throw new Error(`Resend admin query error: ${adminErr.message}`);

    // Auto-reply to sender
    const { error: replyErr } = await resend.emails.send({
        from: FROM_ADDRESS,
        to: email,
        subject: `We received your query — ${subject}`,
        html: queryConfirmTemplate(name, subject)
    });
    if (replyErr) throw new Error(`Resend query reply error: ${replyErr.message}`);
};
