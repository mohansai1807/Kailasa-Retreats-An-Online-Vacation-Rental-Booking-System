if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

// console.log(process.env.SECRET);


// Core framework and server setup
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 8080;

// Database and view engine support
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

// Session, flash messages, and authentication
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

// Application models
const User = require('./models/user');

// Route imports
const listingRouter = require('./routes/listing');
const reviewRouter = require('./routes/review');
const userRouter = require('./routes/user');
const bookingRouter = require('./routes/booking');
const bookingsMainRouter = require('./routes/bookingsMain');
const contactRouter = require('./routes/contact');

// View engine and parser setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Trust Render's reverse proxy so secure cookies work over HTTPS
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Session cookie settings
const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' // Use secure cookies on Render (HTTPS)
  }
};

// Use sessions for login state
app.use(session(sessionOptions));

// Use flash messages for one-time alerts
app.use(flash());

// Initialize Passport for authentication
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport local strategy and session serialization
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to expose flash messages and current user to all views
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user;
  next();
});

// Database connection
async function main() {
  await mongoose.connect(process.env.ATLAS_URI);
  console.log("Connected to MongoDB Atlas");
}

main()
  .then(() => {
    console.log('Database connection successful');
  })
  .catch(err => console.error(err));

// Home page route
app.get('/', (req, res) => {
  res.render('listings/welcome.ejs');
});

// Mount Routes
app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);
app.use('/listings/:id/bookings', bookingRouter);
app.use('/bookings', bookingsMainRouter);
app.use('/', contactRouter);
app.use('/', userRouter);

// Error Handling: preventing from the app crash
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('listings/error.ejs', { error: err.message });
});

app.use((req, res) => {
  res.status(404).render('listings/error.ejs');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
