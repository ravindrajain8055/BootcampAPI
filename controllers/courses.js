const Course = require('../models/Course')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Bootcamp = require('../models/Bootcamp')


// access public
// route GET api/courses
// route GET /api/bootcamps/:bootcampId/courses
exports.getCourses = asyncHandler( async (req, res, next) => {
    if(req.params.bootcampId){
        const courses = await Course.find({bootcamp: req.params.bootcampId})

        return res.status(200).json({
            success:true,
            count:courses.length,
            data:courses
        })
    }else{
        res.status(200).json(res.advancedResults);
    }
});

// access public
// route GET api/courses/:id
exports.getCourse = asyncHandler( async (req, res, next) => {

    const course = await Course.findById(req.params.id).populate({
        path:'bootcamp',
        select:"name"
    });

    if(!course){
        return next(new ErrorResponse("no course available",404))
    }

    res.status(200).json({
        success:true,
        data:course
    })
});

// access public
// route POST api/bootcamps/:bootcampId/courses
exports.addCourse = asyncHandler( async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId

    const bootcamp = Bootcamp.findById(req.params.bootcampId);

    if(!bootcamp){
        return next(new ErrorResponse("no Bootcamp available",404))
    }

    const course = await Course.create(req.body);

    res.status(200).json({
        success:true,
        data:course
    })
});

// access private
// route PUT api/courses/:id
exports.updateCourse = asyncHandler( async (req, res, next) => {

    let course = await Course.findById(req.params.id)

    if(!course){
        return next(new ErrorResponse("no course found",404))
    }

    course = await Course.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    });
    
    res.status(200).json({
        success:true,
        data:course
    })
});

// access private
// route DELETE api/courses/:id
exports.deleteCourse = asyncHandler( async (req, res, next) => {

    let course = await Course.findById(req.params.id)

    if(!course){
        return next(new ErrorResponse("no course found",404))
    }

    await course.remove();
    
    res.status(200).json({
        success:true,
        data:{}
    })
});