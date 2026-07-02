const { Resend } = require("resend");
const {
  otpTemplate,
  welcomeTemplate,
  queryAdminTemplate,
  queryConfirmTemplate,
} = require("./emailTemplates");

const resend = new Resend(process.env.RESEND_API_KEY);

// Send OTP verification email
module.exports.sendOtpEmail = async (to, otp) => {
  await resend.emails.send({
    from: "Kailasa Retreats <onboarding@resend.dev>",
    to,
    subject: `${otp} is your Kailasa Retreats verification code`,
    html: otpTemplate(otp),
  });
};

// Send welcome email
module.exports.sendWelcomeEmail = async (to, username) => {
  await resend.emails.send({
    from: "Kailasa Retreats <onboarding@resend.dev>",
    to,
    subject: `Welcome to Kailasa Retreats, ${username}!`,
    html: welcomeTemplate(username),
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
  await resend.emails.send({
    from: "Kailasa Retreats <onboarding@resend.dev>",
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
  await resend.emails.send({
    from: "Kailasa Retreats <onboarding@resend.dev>",
    to: email,
    subject: `We received your query — ${subject}`,
    html: queryConfirmTemplate(name, subject),
  });
};