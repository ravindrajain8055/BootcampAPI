const express = require("express");
const { getBootcamps,
    getBootcamp, 
    createBootcamp, 
    updateBootcamp, 
    deleteBootcamp,
    getBootcampInRadius,
    bootcampPhotoUpload} = require("../controllers/bootcamps")

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth')

const Bootcamp = require('../models/Bootcamp')
//resource router 
const courseRouter = require('./courses');

const router = express.Router();

// Re-route to resource router
router.use('/:bootcampId/courses',courseRouter)

router.route('/radius/:zipcode/:distance')
    .get(getBootcampInRadius)

router.route('/')
    .get(advancedResults(Bootcamp,'courses'), getBootcamps)
    .post(protect,authorize('publisher','admin'), createBootcamp)

router.route('/:id')
    .get(getBootcamp)
    .put(protect,authorize('publisher','admin'),updateBootcamp)
    .delete(protect,authorize('publisher','admin'),deleteBootcamp)

router.route('/:id/photo')
    .put(protect,authorize('publisher','admin'), bootcampPhotoUpload)

module.exports = router;
