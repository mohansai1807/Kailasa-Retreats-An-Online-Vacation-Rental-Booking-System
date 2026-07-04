const nodemailer = require("nodemailer");
const {
  otpTemplate,
  welcomeTemplate,
  loginSuccessTemplate,
  queryAdminTemplate,
  queryConfirmTemplate,
} = require("./emailTemplates");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT || 587),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
};

// Send OTP verification email
module.exports.sendOtpEmail = async (to, otp) => {
  await sendMail({
    to,
    subject: `${otp} is your Kailasa Retreats verification code`,
    html: otpTemplate(otp),
  });
};

// Send welcome email
module.exports.sendWelcomeEmail = async (to, username) => {
  await sendMail({
    to,
    subject: `Welcome to Kailasa Retreats, ${username}!`,
    html: welcomeTemplate(username),
  });
};

// Send login success greeting email
module.exports.sendLoginSuccessEmail = async (to, username) => {
  await sendMail({
    to,
    subject: `You're now signed in — Welcome back, ${username}!`,
    html: loginSuccessTemplate(username),
  });
};

// Send contact email
module.exports.sendQueryEmail = async ({
  name,
  email,
  phone,
  subject,
  message,
}) => {
  // Send to admin
  await sendMail({
    to: process.env.ADMIN_EMAIL,
    subject: `New Query: ${subject}`,
    html: queryAdminTemplate({
      name,
      email,
      phone,
      subject,
      message,
    }),
  });

  // Auto reply to user
  await sendMail({
    to: email,
    subject: `We received your query — ${subject}`,
    html: queryConfirmTemplate(name, subject),
  });
};