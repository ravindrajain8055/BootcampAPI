const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')
const path = require('path');

// access public
// route GET /api/bootcamps
exports.getBootcamps = asyncHandler( async (req, res, next) => {
    res.status(200).json(res.advancedResults);     
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
    req.body.user = req.user.id
    

     // Check for published bootcamp
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  // If the user is not an admin, they can only add one bootcamp
    if (publishedBootcamp && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `The user with ID ${req.user.id} has already published a bootcamp`,
          400
        )
      );
    }

  const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
        success:true,
        data:bootcamp
    });   
});


// access private
// route PUT /api/bootcamps/:d
exports.updateBootcamp = asyncHandler( async (req, res, next) => {
    let bootcamp = await Bootcamp.findById(req.params.id);

    if(!bootcamp){
        return next(new ErrorResponse('Bootcamp not found',404));
    }
    // Make sure thats its a bootcamp owner
    if(bootcamp.user.toString() !== req.user.id && req.user.role !== "admin"){
      return next( new ErrorResponse('User not authorized to update the bootcamp',401));
    }

    bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body,{
      new:true,
      runValidators:true
  })
    res.status(200).json({sucess:true,data:bootcamp});
    
})

// access private
// route DELETE /api/bootcamps/:id
exports.deleteBootcamp = asyncHandler( async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if(!bootcamp){
        return next(new ErrorResponse('Bootcamp not found',404));
    }

    if(bootcamp.user.toString() !== req.user.id && req.user.role !== "admin"){
      return next( new ErrorResponse('User not authorized to delete the bootcamp',401));
    }
    
    bootcamp.remove();
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

// access private
// route PUT /api/bootcamps/:id/photo
exports.bootcampPhotoUpload = asyncHandler( async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if(!bootcamp){
        return next(new ErrorResponse('Bootcamp not found',404));
    }
    
    if(bootcamp.user.toString() !== req.user.id && req.user.role !== "admin"){
      return next( new ErrorResponse('User not authorized to update the bootcamp',401));
    }
    
    if(!req.files){
        return next(new ErrorResponse('Plz add a file',404));
    }

    const file = req.files.file

      // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.error(err);
        return next(new ErrorResponse(`Problem with file upload`, 500));
        }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name
    });
  });

    res.status(200).json({sucess:true});  

});