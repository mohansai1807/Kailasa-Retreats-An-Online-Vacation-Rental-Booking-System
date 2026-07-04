// Shared brand styles for all email templates
const brandColor = '#ff385c';
const fontStack = "'Segoe UI', Arial, sans-serif";

// Safely build the base URL — strip any trailing slash so links never get double slashes
const appUrl = () => (process.env.APP_URL || 'http://localhost:8080').replace(/\/$/, '');

const baseWrapper = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f7f7f7;font-family:${fontStack};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f7;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#ff385c,#e61e4d);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">Kailasa Retreats</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">Your Premium Vacation Rental Destination</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f7f7f7;padding:20px 40px;text-align:center;border-top:1px solid #eeeeee;">
              <p style="margin:0;color:#aaaaaa;font-size:12px;">© ${new Date().getFullYear()} Kailasa Retreats. All rights reserved.</p>
              <p style="margin:4px 0 0;color:#aaaaaa;font-size:12px;">This email was sent to you because you created an account with us.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

// OTP email template
module.exports.otpTemplate = (otp) => baseWrapper(`
  <h2 style="margin:0 0 8px;color:#222222;font-size:22px;font-weight:700;">Verify Your Email</h2>
  <p style="margin:0 0 28px;color:#717171;font-size:15px;line-height:1.6;">
    Use the 6-digit code below to verify your account. This code expires in <strong>10 minutes</strong>.
  </p>
  <!-- OTP Box -->
  <div style="background:#fff5f7;border:2px solid ${brandColor};border-radius:12px;padding:28px;text-align:center;margin-bottom:28px;">
    <p style="margin:0 0 6px;color:#717171;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Your Verification Code</p>
    <p style="margin:0;font-size:48px;font-weight:800;color:${brandColor};letter-spacing:10px;font-family:monospace;">${otp}</p>
  </div>
  <div style="background:#fff8e1;border-left:4px solid #ffb300;border-radius:4px;padding:14px 18px;margin-bottom:20px;">
    <p style="margin:0;color:#555;font-size:13px;">
      ⏰ This code will expire in <strong>10 minutes</strong>. Do not share this code with anyone.
    </p>
  </div>
  <p style="margin:0;color:#aaaaaa;font-size:13px;">If you did not create a Kailasa Retreats account, you can safely ignore this email.</p>
`);

// Welcome email template (fires after signup OTP verification)
module.exports.welcomeTemplate = (username) => baseWrapper(`
  <h2 style="margin:0 0 8px;color:#222222;font-size:22px;font-weight:700;">Welcome, ${username}! 🎉</h2>
  <p style="margin:0 0 24px;color:#717171;font-size:15px;line-height:1.6;">
    Your account has been verified and you're all set to explore our premium vacation retreats across India and beyond.
  </p>
  <div style="background:#f0fff4;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
    <p style="margin:0;color:#2d6a4f;font-size:14px;font-weight:600;">✅ Your account is now fully verified</p>
    <p style="margin:6px 0 0;color:#52796f;font-size:13px;">You can now browse listings, make bookings, and leave reviews.</p>
  </div>
  <div style="text-align:center;margin:28px 0;">
    <a href="${appUrl()}/listings"
       style="background:${brandColor};color:#ffffff;padding:14px 36px;border-radius:999px;text-decoration:none;font-size:15px;font-weight:600;display:inline-block;">
      Browse Retreats →
    </a>
  </div>
  <p style="margin:0;color:#aaaaaa;font-size:13px;text-align:center;">Happy exploring with Kailasa Retreats!</p>
`);

// Login success greeting email (fires after successful OTP login)
module.exports.loginSuccessTemplate = (username) => baseWrapper(`
  <h2 style="margin:0 0 8px;color:#222222;font-size:22px;font-weight:700;">Welcome back, ${username}! 👋</h2>
  <p style="margin:0 0 24px;color:#717171;font-size:15px;line-height:1.6;">
    You have successfully signed in to your Kailasa Retreats account. Ready to plan your next getaway?
  </p>
  <div style="background:#f0f7ff;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
    <p style="margin:0;color:#1a56db;font-size:14px;font-weight:600;">🔐 Secure login verified</p>
    <p style="margin:6px 0 0;color:#4b7bb5;font-size:13px;line-height:1.6;">
      Your identity was confirmed via OTP. If this wasn't you, please change your password immediately.
    </p>
  </div>
  <div style="text-align:center;margin:28px 0;">
    <a href="${appUrl()}/listings"
       style="background:${brandColor};color:#ffffff;padding:14px 36px;border-radius:999px;text-decoration:none;font-size:15px;font-weight:600;display:inline-block;">
      🏡 Explore Retreats Now
    </a>
  </div>
  <p style="margin:0 0 8px;color:#aaaaaa;font-size:13px;text-align:center;">
    Discover handpicked retreats across India. Book your perfect stay in minutes.
  </p>
  <p style="margin:0;color:#dddddd;font-size:12px;text-align:center;">
    If you did not sign in, please 
    <a href="${appUrl()}/login" style="color:${brandColor};text-decoration:none;">secure your account here</a>.
  </p>
`);

// Query admin notification template
module.exports.queryAdminTemplate = ({ name, email, phone, subject, message }) => baseWrapper(`
  <h2 style="margin:0 0 8px;color:#222222;font-size:22px;font-weight:700;">New Contact Query</h2>
  <p style="margin:0 0 24px;color:#717171;font-size:15px;">A new inquiry was submitted via the Contact form.</p>
  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
    <tr><td style="padding:10px 0;border-bottom:1px solid #eeeeee;color:#717171;font-size:13px;width:30%;">Name</td>
        <td style="padding:10px 0;border-bottom:1px solid #eeeeee;color:#222;font-size:14px;font-weight:600;">${name}</td></tr>
    <tr><td style="padding:10px 0;border-bottom:1px solid #eeeeee;color:#717171;font-size:13px;">Email</td>
        <td style="padding:10px 0;border-bottom:1px solid #eeeeee;color:#222;font-size:14px;font-weight:600;">${email}</td></tr>
    <tr><td style="padding:10px 0;border-bottom:1px solid #eeeeee;color:#717171;font-size:13px;">Phone</td>
        <td style="padding:10px 0;border-bottom:1px solid #eeeeee;color:#222;font-size:14px;font-weight:600;">${phone || 'Not provided'}</td></tr>
    <tr><td style="padding:10px 0;border-bottom:1px solid #eeeeee;color:#717171;font-size:13px;">Subject</td>
        <td style="padding:10px 0;border-bottom:1px solid #eeeeee;color:#222;font-size:14px;font-weight:600;">${subject}</td></tr>
  </table>
  <p style="margin:0 0 8px;color:#717171;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Message</p>
  <div style="background:#f7f7f7;border-radius:8px;padding:18px;color:#222;font-size:14px;line-height:1.7;">${message}</div>
`);

// Auto-reply to query sender
module.exports.queryConfirmTemplate = (name, subject) => baseWrapper(`
  <h2 style="margin:0 0 8px;color:#222222;font-size:22px;font-weight:700;">We received your query!</h2>
  <p style="margin:0 0 20px;color:#717171;font-size:15px;line-height:1.6;">
    Hi <strong>${name}</strong>, thank you for reaching out to Kailasa Retreats.
  </p>
  <div style="background:#f0f7ff;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
    <p style="margin:0;color:#1a56db;font-size:14px;font-weight:600;">📩 Subject: ${subject}</p>
    <p style="margin:8px 0 0;color:#4b7bb5;font-size:13px;line-height:1.6;">
      Our team will review your inquiry and get back to you within <strong>24–48 hours</strong>.
    </p>
  </div>
  <div style="text-align:center;margin:24px 0;">
    <a href="${appUrl()}/listings"
       style="background:${brandColor};color:#ffffff;padding:12px 32px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:600;display:inline-block;">
      Browse Listings
    </a>
  </div>
  <p style="margin:0;color:#aaaaaa;font-size:13px;text-align:center;">Thank you for choosing Kailasa Retreats!</p>
`);

