const { Resend } = require("resend");
const {
  otpTemplate,
  welcomeTemplate,
  loginSuccessTemplate,
  queryAdminTemplate,
  queryConfirmTemplate,
} = require("./emailTemplates");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async ({ to, subject, html }) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not defined in environment variables");
  }

  // Resend onboarding domain requires from address to use onboarding@resend.dev
  const fromAddress = 'Kailasa Retreats <onboarding@resend.dev>';

  const { data, error } = await resend.emails.send({
    from: fromAddress,
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(`Resend Error: ${error.message || JSON.stringify(error)}`);
  }

  return data;
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
    to: process.env.ADMIN_EMAIL || 'saikmohan1@gmail.com',
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