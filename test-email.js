// Quick diagnostic script - run with: node test-email.js
// This tests if your Gmail SMTP credentials work from this server

require('dotenv').config();

const nodemailer = require('nodemailer');

async function testEmail() {
    console.log('--- Email Diagnostic ---');
    console.log('EMAIL_USER:', process.env.EMAIL_USER || 'MISSING');
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? `SET (${process.env.EMAIL_PASS.length} chars)` : 'MISSING');
    console.log('');

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('ERROR: Email environment variables not set!');
        process.exit(1);
    }

    // Test port 465 (SSL)
    console.log('Testing Gmail SMTP port 465 (SSL)...');
    try {
        const t = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });
        await t.verify();
        console.log('✅ Port 465 WORKS!');
    } catch (err) {
        console.error('❌ Port 465 FAILED:', err.code, '-', err.message);
    }

    // Test port 587 (STARTTLS)
    console.log('Testing Gmail SMTP port 587 (STARTTLS)...');
    try {
        const t = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });
        await t.verify();
        console.log('✅ Port 587 WORKS!');
    } catch (err) {
        console.error('❌ Port 587 FAILED:', err.code, '-', err.message);
    }

    process.exit(0);
}

testEmail();
