const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// access public
// route GET /api/bootcamps
exports.getBootcamps = asyncHandler( async (req, res, next) => {
    const bootcamps = await Bootcamp.find();

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