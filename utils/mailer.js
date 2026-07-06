const sgMail = require("@sendgrid/mail");

const {
  otpTemplate,
  welcomeTemplate,
  loginSuccessTemplate,
  queryAdminTemplate,
  queryConfirmTemplate,
} = require("./emailTemplates");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const fromAddress =
  process.env.EMAIL_FROM || "Kailasa Retreats <saikmohan1@gmail.com>";

const sendMail = async ({ to, subject, html }) => {
  try {
    const msg = {
      to,
      from: fromAddress,
      subject,
      html,
    };

    const response = await sgMail.send(msg);

    console.log("✅ Email Sent");
    return response;
  } catch (err) {
    console.error("❌ SendGrid Error");

    if (err.response) {
      console.error(err.response.body);
    } else {
      console.error(err);
    }

    throw err;
  }
};

// OTP
const sendOtpEmail = (to, otp) =>
  sendMail({
    to,
    subject: `${otp} is your Kailasa Retreats verification code`,
    html: otpTemplate(otp),
  });

// Welcome
const sendWelcomeEmail = (to, username) =>
  sendMail({
    to,
    subject: `Welcome to Kailasa Retreats, ${username}!`,
    html: welcomeTemplate(username),
  });

// Login Success
const sendLoginSuccessEmail = (to, username) =>
  sendMail({
    to,
    subject: `You're now signed in — Welcome back, ${username}!`,
    html: loginSuccessTemplate(username),
  });

// Contact Form
const sendQueryEmail = async ({
  name,
  email,
  phone,
  subject,
  message,
}) => {
  const adminEmail =
    process.env.ADMIN_EMAIL || process.env.EMAIL_FROM;

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

  await sendMail({
    to: email,
    subject: "We received your query",
    html: queryConfirmTemplate(name, subject),
  });
};

module.exports = {
  sendOtpEmail,
  sendWelcomeEmail,
  sendLoginSuccessEmail,
  sendQueryEmail,
};