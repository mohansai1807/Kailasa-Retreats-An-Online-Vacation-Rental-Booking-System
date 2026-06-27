const Booking = require('../models/booking');
const Listing = require('../models/listing');

module.exports.new = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash('error', 'Listing not found');
      return res.redirect('/listings');
    }
    res.render('bookings/new.ejs', { listing });
  } catch (err) {
    next(err);
  }
};

module.exports.create = async (req, res, next) => {
  try {
    const { id } = req.params; // listing id
    const { checkIn, checkOut, guests } = req.body.booking || req.body;
    const booking = new Booking({
      user: req.user._id,
      listing: id,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guests: Number(guests) || 1
    });
    await booking.save();
    req.flash('success', 'Booking created successfully');
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.index = async (req, res, next) => {
  try {
    const user = res.locals.currUser;
    let bookings;
    if (user && user.username === 'mohanasai') {
      bookings = await Booking.find({}).populate('listing').populate('user');
    } else {
      bookings = await Booking.find({ user: req.user._id }).populate('listing');
    }
    res.render('bookings/index.ejs', { bookings });
  } catch (err) {
    next(err);
  }
};
