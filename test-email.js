require('dotenv').config();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function testSend() {
    console.log('Sending test email using Resend API to:', process.env.EMAIL_USER);
    try {
        const { data, error } = await resend.emails.send({
            from: 'Kailasa Retreats <onboarding@resend.dev>',
            to: process.env.EMAIL_USER || 'saikmohan1@gmail.com',
            subject: 'Resend Test OTP',
            html: '<strong>Your test code is 123456</strong>'
        });

        if (error) {
            console.error('❌ Resend returned an error:', error);
        } else {
            console.log('✅ Email sent successfully via Resend! ID:', data.id);
        }
    } catch (err) {
        console.error('❌ Failed to send test email:', err);
    }
    process.exit(0);
}

testSend();
