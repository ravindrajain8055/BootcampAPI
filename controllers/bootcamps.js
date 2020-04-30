const Bootcamp = require('../models/Bootcamp')

// access public
// route GET /api/bootcamps
exports.getBootcamps = async (req, res, next) => {
    const bootcamps = await Bootcamp.find();

    res.status(200).json({
        success:true,
        count:bootcamps.length,
        data:bootcamps
    })
    
}

// access public
// route GET /api/bpptcamps/:id
exports.getBootcamp = async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){
        return res.status(400).json({
            success:false
        });
    }

    res.status(200).json({
        success:true,
        data:bootcamp
    })
}

// access private
// route POST /api/bootcamps
exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body);

        res.status(201).json({
            success:true,
            data:bootcamp
    });   
    } catch (error) {
        res.status(400).json({
            success:false
        })
    }
    
}


// access private
// route PUT /api/bootcamps/:d
exports.updateBootcamp = async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body,{
        new:true,
        runValidators:true
    });

    if(!bootcamp){
        return res.status(400).json({
            success:false
        });
    }
    res.status(200).json({sucess:true,data:bootcamp});

}

// access private
// route DELETE /api/bootcamps/:id
exports.deleteBootcamp = async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if(!bootcamp){
        return res.status(400).json({
            success:false
        });
    }
    res.status(200).json({sucess:true});

}