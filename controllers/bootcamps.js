const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')

// access public
// route GET /api/bootcamps
exports.getBootcamps = asyncHandler( async (req, res, next) => {
    let query;

    const reqQuery = { ...req.query };
    // fields to exclude
    const removeFields = ['select','sort'];
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = Bootcamp.find(JSON.parse(queryStr));

    // select
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
      }

    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(" ")
        query = query.sort(sortBy);
    }else{
        query = query.sort('-createdAt');
    }
    
    const bootcamps = await query;

    res.status(200).json({
        success:true,
        count:bootcamps.length,
        data:bootcamps
    }) 
       
});

// access public
// route GET /api/bpptcamps/:id
exports.getBootcamp = asyncHandler( async (req, res, next) => {
    
    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){
        return next(new ErrorResponse('Bootcamp not found',404));
    }

    res.status(200).json({
        success:true,
        data:bootcamp
    });

});

// access private
// route POST /api/bootcamps
exports.createBootcamp = asyncHandler( async (req, res, next) => {
        const bootcamp = await Bootcamp.create(req.body);

        res.status(201).json({
            success:true,
            data:bootcamp
    });   
});


// access private
// route PUT /api/bootcamps/:d
exports.updateBootcamp = asyncHandler( async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body,{
        new:true,
        runValidators:true
    });

    if(!bootcamp){
        return next(new ErrorResponse('Bootcamp not found',404));
    }
    res.status(200).json({sucess:true,data:bootcamp});
    
})

// access private
// route DELETE /api/bootcamps/:id
exports.deleteBootcamp = asyncHandler( async (req, res, next) => {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

        if(!bootcamp){
            return next(new ErrorResponse('Bootcamp not found',404));
        }
        
        res.status(200).json({sucess:true});  

});

// access private
// route GET /api/bootcamps/radius/:zipcode/:distance
exports.getBootcampInRadius = asyncHandler( async (req, res, next) => {
    const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radius, Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 6378;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });

});