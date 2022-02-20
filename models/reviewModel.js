const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      require: [true, 'Review Cannot be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    refToTour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    refToUser: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// INDEXES
reviewSchema.index({ refToTour: 1, refToUser: 1 }, { unique: true }); // to not allow user give more than one review for each tour

// MIDDLEWARE

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'refToUser',
    select: 'name photo',
  });

  next();
});

// CALCULATIONG AVERAGE
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { refToTour: tourId },
    },
    {
      $group: {
        _id: '$refToTour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.refToTour);
});

// findOneAnd gives acces to the query not the model
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne(); // get the object ID
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // this.findOne() doesn't work here because the query already executed
  if (this.r) await this.r.constructor.calcAverageRatings(this.r.refToTour);
});
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
