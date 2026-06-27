const User = require('../models/user');

module.exports.renderSignupForm = (req, res) => {
  res.render('users/signup.ejs');
};

module.exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const regUser = await User.register(newUser, password);
    console.log(regUser);
    req.flash('success', 'Welcome to Kailasa retreats!');
    res.redirect('/listings');
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/signup');
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render('users/login.ejs');
};

module.exports.login = (req, res) => {
  req.flash('success', 'Welcome to Kailasa Retreats! You are successfully logged in');
  const redirectUrl = res.locals.redirectUrl || '/listings';
  req.session.redirectUrl = null;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout(err => {
    if (err) {
      return next(err);
    }

    req.flash('success', 'User logged out successfully');
    res.redirect('/');
  });
};
