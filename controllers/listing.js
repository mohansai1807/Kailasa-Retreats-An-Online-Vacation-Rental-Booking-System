const Listing = require('../models/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAPBOX_TOKEN;
let geocodingClient;

if (mapToken && (mapToken.startsWith("pk.") || mapToken.startsWith("sk."))) {
  try {
    geocodingClient = mbxGeocoding({ accessToken: mapToken });
  } catch (err) {
    console.error("Failed to initialize Mapbox client:", err);
  }
} else {
  console.warn("Mapbox Token is missing or invalid. Geocoding will be disabled and fallbacks will be used.");
}


module.exports.index = async (req, res, next) => {
  try {
    const category = req.query.category;
    let filter = {};
    if (category) {
      filter.category = category;
    }
    const listings = await Listing.find(filter);
    res.render('listings/index.ejs', { listings, category });
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

    const isFallbackDelhi = listing.geometry && 
                            listing.geometry.coordinates && 
                            listing.geometry.coordinates[0] === 77.2090 && 
                            listing.geometry.coordinates[1] === 28.6139;

    if (!listing.geometry || !listing.geometry.coordinates || listing.geometry.coordinates.length === 0 || isFallbackDelhi) {
      try {
        if (geocodingClient) {
          const response = await geocodingClient.forwardGeocode({
            query: `${listing.location}, ${listing.country}`,
            limit: 1
          }).send();
          if (response && response.body && response.body.features && response.body.features.length > 0) {
            listing.geometry = response.body.features[0].geometry;
            await listing.save();
          }
        }
      } catch (geocodeErr) {
        console.error("Geocoding failed during show:", geocodeErr);
      }
    }

    console.log(listing);
    res.render("listings/show", {
        listing,
        mapToken: process.env.MAPBOX_TOKEN
    });
  } catch (err) {
    next(err);
  }
};

module.exports.new = (req, res) => {
  res.render('listings/new.ejs');
};

module.exports.create = async (req, res, next) => {
  try {
    let response;
    try {
      if (process.env.MAPBOX_TOKEN) {
          response = await geocodingClient.forwardGeocode({
          query: req.body.listing.location,
          limit: 1
        }).send();
      }
    } catch (geocodeErr) {
      console.error("Geocoding failed during creation:", geocodeErr);
    }

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    if (response && response.body && response.body.features && response.body.features.length > 0) {
      newListing.geometry = response.body.features[0].geometry;
    } else {
      // Fallback coordinate: New Delhi [lng, lat]
      newListing.geometry = { type: 'Point', coordinates: [77.2090, 28.6139] };
    }

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
    const { title, description, price, location, country, category } = req.body.listing;

    let listing = await Listing.findById(id);

    // Geocode the new location if location has changed or if geometry is missing
    if (listing.location !== location || !listing.geometry) {
      let response;
      try {
        if (geocodingClient) {
          response = await geocodingClient.forwardGeocode({
            query: location,
            limit: 1
          }).send();
        }
      } catch (geocodeErr) {
        console.error("Geocoding failed during update:", geocodeErr);
      }

      if (response && response.body && response.body.features && response.body.features.length > 0) {
        listing.geometry = response.body.features[0].geometry;
      } else if (!listing.geometry) {
        // Fallback coordinate: New Delhi
        listing.geometry = { type: 'Point', coordinates: [77.2090, 28.6139] };
      }
    }

    listing.title = title;
    listing.description = description;
    listing.price = price;
    listing.location = location;
    listing.country = country;
    listing.category = category;

    // Update image only if a new one is uploaded
    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    await listing.save();

    req.flash("success", "Updated Successfully");
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
