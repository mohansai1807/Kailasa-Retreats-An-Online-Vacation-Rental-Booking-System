const nodemailer = require("nodemailer");
const {
  otpTemplate,
  welcomeTemplate,
  loginSuccessTemplate,
  queryAdminTemplate,
  queryConfirmTemplate,
} = require("./emailTemplates");

const transporter = nodemailer.createTransport({
  service: "gmail",
  family: 4, // Force IPv4

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

// Verify SMTP connection when the server starts
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Verification Failed");
    console.error(error);
  } else {
    console.log("✅ Gmail SMTP Server is ready");
  }
});

transporter.verify((err) => {
  if (err) {
    console.error("❌ SMTP Verification Failed");
    console.error(err);
  } else {
    console.log("✅ Gmail SMTP Connected");
  }
});

const fromAddress =
  process.env.EMAIL_FROM ||
  `Kailasa Retreats <${process.env.EMAIL_USER}>`;

const sendMail = async ({ to, subject, html }) => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📧 Sending Email");
  console.log("To:", to);
  console.log("Subject:", subject);

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      html,
    });

    console.log("✅ Email Sent");
    console.log(info.messageId);

    return info;
  } catch (err) {
    console.error("❌ Email Sending Failed");
    console.error(err);
    throw err;
  }
};

// OTP
const sendOtpEmail = async (to, otp) => {
  return sendMail({
    to,
    subject: `${otp} is your Kailasa Retreats verification code`,
    html: otpTemplate(otp),
  });
};

// Welcome
const sendWelcomeEmail = async (to, username) => {
  return sendMail({
    to,
    subject: `Welcome to Kailasa Retreats, ${username}!`,
    html: welcomeTemplate(username),
  });
};

// Login Success
const sendLoginSuccessEmail = async (to, username) => {
  return sendMail({
    to,
    subject: `You're now signed in — Welcome back, ${username}!`,
    html: loginSuccessTemplate(username),
  });
};

// Contact Form
const sendQueryEmail = async ({
  name,
  email,
  phone,
  subject,
  message,
}) => {
  const adminEmail =
    process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

  console.log("🚀 Starting Contact Email");

  console.log("➡ Sending Admin Email");

  await sendMail({
    to: adminEmail,
    subject: `New Query: ${subject}`,
    html: queryAdminTemplate({
      name,
      email,
      phone,
      subject,
      message,
    }),
  });

  console.log("✅ Admin Email Sent");

  console.log("➡ Sending User Confirmation");

  await sendMail({
    to: email,
    subject: `We received your query`,
    html: queryConfirmTemplate(name, subject),
  });

  console.log("✅ User Confirmation Sent");
};

module.exports = {
  sendOtpEmail,
  sendWelcomeEmail,
  sendLoginSuccessEmail,
  sendQueryEmail,
};