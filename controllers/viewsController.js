const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsynch = require('../utils/catchAsynch');
const AppError = require('../utils/AppError');

exports.getOverview = catchAsynch(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();
  // 2) Build template based on tours

  // 3) Render that template using tour data from 1)
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://*.tiles.mapbox.com https://api.mapbox.com https://events.mapbox.com"
    )
    .render('overview', {
      title: 'All Tours',
      tours,
    });
});

exports.getTour = catchAsynch(async (req, res, next) => {
  // 1) Get the data , for the request tour
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) return next(new AppError('There is no tour with that name', 404));
  // 2) Build template
  // 3) Render template using data
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://*.tiles.mapbox.com https://api.mapbox.com https://events.mapbox.com"
    )
    .render('tour', {
      title: `${tour.name} Tour`,
      tour,
    });
});

exports.getLoginForm = async (req, res) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://*.tiles.mapbox.com https://api.mapbox.com https://events.mapbox.com"
    )
    .render('login', {
      title: 'Log to your account',
    });
};

exports.getAccount = async (req, res) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://*.tiles.mapbox.com https://api.mapbox.com https://events.mapbox.com"
    )
    .render('account', {
      title: 'Your Account',
    });
};

exports.updateUserData = catchAsynch(async (req, res, next) => {
  const updaterUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://*.tiles.mapbox.com https://api.mapbox.com https://events.mapbox.com"
    )
    .render('account', {
      title: 'Your Account',
      user: updaterUser,
    });
});

exports.getMyTours = catchAsynch(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: `${req.user.id}` });

  // 2) Find tours with the reutrned IDs
  const tourIDs = bookings.map((el) => el.tour.id);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://*.tiles.mapbox.com https://api.mapbox.com https://events.mapbox.com"
    )
    .render('overview', {
      title: 'My tours',
      tours,
    });
});
