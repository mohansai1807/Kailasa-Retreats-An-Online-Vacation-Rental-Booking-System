const { sendQueryEmail } = require('../utils/mailer');

module.exports.renderContactForm = (req, res) => {
    res.render('contact.ejs');
};

module.exports.submitContactForm = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // Basic validation
        if (!name || !email || !subject || !message) {
            req.flash('error', 'Please fill in all required fields.');
            return res.redirect('/contact');
        }

        await sendQueryEmail({ name, email, phone, subject, message });

        req.flash('success', `Thank you, ${name}! Your query has been received. We'll get back to you within 24–48 hours.`);
        res.redirect('/contact');
    } catch (err) {
        console.error('Contact form error:', err.message);
        req.flash('error', 'Something went wrong. Please try again later.');
        res.redirect('/contact');
    }
};
