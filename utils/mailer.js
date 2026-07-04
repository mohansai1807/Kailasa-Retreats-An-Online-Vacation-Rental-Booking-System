const nodemailer = require("nodemailer");
const {
  otpTemplate,
  welcomeTemplate,
  loginSuccessTemplate,
  queryAdminTemplate,
  queryConfirmTemplate,
} = require("./emailTemplates");

let resendClient = null;

try {
  const { Resend } = require("resend");
  if (process.env.RESEND_API_KEY) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
} catch (err) {
  resendClient = null;
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT || 587),
  secure: Number(process.env.EMAIL_PORT || 587) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const fromAddress = process.env.EMAIL_FROM || process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

const sendMail = async ({ to, subject, html }) => {
  if (resendClient && process.env.RESEND_API_KEY) {
    const { data, error } = await resendClient.emails.send({
      from: process.env.RESEND_FROM || "Kailasa Retreats <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    if (error) {
      throw new Error(error.message || "Resend email delivery failed");
    }

    return data;
  }

  await transporter.sendMail({
    from: fromAddress,
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
  const adminEmail = process.env.ADMIN_EMAIL || 'saikmohan1@gmail.com';

  // Send to admin
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

  // Auto reply to user
  await sendMail({
    to: email,
    subject: `We received your query — ${subject}`,
    html: queryConfirmTemplate(name, subject),
  });
};