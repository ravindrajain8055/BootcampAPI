const Course = require('../models/Course')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// access public
// route GET api/courses
// route GET /api/bootcamps/:bootcampId/courses
exports.getBootcamps = asyncHandler( async (req, res, next) => {
    let query;

    if (req.params.bootcampId){
        query = course.find({
            bootcamp: req.params.bootcampId
        })
    }else{
        query = course.find()
    }

    const courses = await query;
});