const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

//MIDDLEWAR LOCAL WITH PARAMS
/* router.param('id', tourController.checkID); */

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top5Tours')
  .get(tourController.top5Tours, tourController.getAllTours); // alliassing

router.route('/tour-stats').get(tourController.getTourStats); //agregation

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  ); //agregation

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin); // gives the tour within a radius

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances); // gives the distances from each tour

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
