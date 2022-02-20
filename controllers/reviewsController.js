const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  //ALLOW NEXTED ROUTES

  if (!req.body.refToTour) req.body.refToTour = req.params.tourId;
  if (!req.body.refToUser) req.body.refToUser = req.user.id;

  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.createReview = factory.createOne(Review);
exports.getReview = factory.getOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);

/* exports.getAllReviews = catchAsynch(async (req, res, next) => {

  // Nested route
  let filter = {};
  if (req.params.tourId) filter = { refToTour: req.params.tourId };

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'Success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
}); */
