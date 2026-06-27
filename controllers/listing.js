const Listing = require('../models/listing');

module.exports.index = async (req, res, next) => {
  try {
    const listings = await Listing.find({});
    res.render('listings/index.ejs', { listings });
  } catch (err) {
    next(err);
  }
};

module.exports.show = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({
      path: "reviews",
      populate: {
        path: "author"
      }
    }).populate('owner');

    if (!listing) {
      req.flash('error', 'Listing you requested does not exist please try again!');
      return res.redirect('/listings');
    }

    console.log(listing);
    res.render('listings/show.ejs', { listing });
  } catch (err) {
    next(err);
  }
};

module.exports.new = (req, res) => {
  res.render('listings/new.ejs');
};

module.exports.create = async (req, res, next) => {
  try {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    
    await newListing.save();
    req.flash('success', 'New Listing Created');
    res.redirect('/listings');
  } catch (err) {
    next(err);
  }
};

module.exports.edit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash('error', 'Listing does not exist!');
      return res.redirect('/listings');
    }
    res.render('listings/edit.ejs', { listing });
  } catch (err) {
    next(err);
  }
};

module.exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, image, price, location, country } = req.body.listing || req.body;

    await Listing.findByIdAndUpdate(id, { title, description, image, price, location, country });
    req.flash('success', 'Updated Successfully');
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing Deleted Successfully');
    res.redirect('/listings');
  } catch (err) {
    next(err);
  }
};
