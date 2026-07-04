require('dotenv').config();
const { sendOtpEmail } = require('./utils/mailer');

async function testSend() {
    console.log('Sending actual test OTP email to:', process.env.EMAIL_USER);
    try {
        await sendOtpEmail(process.env.EMAIL_USER, '123456');
        console.log('✅ OTP email sent successfully! Please check your inbox (including Spam folder).');
    } catch (err) {
        console.error('❌ Failed to send test OTP email:', err);
    }
    process.exit(0);
}

testSend();
