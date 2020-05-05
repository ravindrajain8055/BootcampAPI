const express = require("express");
const { getBootcamps,
    getBootcamp, 
    createBootcamp, 
    updateBootcamp, 
    deleteBootcamp,
    getBootcampInRadius,
    bootcampPhotoUpload} = require("../controllers/bootcamps")

const advancedResults = require('../middleware/advancedResults');
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
    .post(createBootcamp)

router.route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp)

router.route('/:id/photo')
    .put(bootcampPhotoUpload)

module.exports = router;
