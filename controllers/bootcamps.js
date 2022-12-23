// These are the set of the middleware function that constitute your Pipeline
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const geocoder = require("../utils/geocoder");
const Bootcamp = require("../models/Bootcamp");
const path = require("path");

// @desc GET Single Bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    msg: `get bootcamp ${req.params.id}`,
    data: bootcamp
  });
});

// @desc GET All Bootcamp
// @route GET /api/v1/bootcamps
// @access Public
exports.getAllBootCamps = asyncHandler(async (req, res, next) => {
  // console.log(res.advancedResults);
  res.status(200).json(res.advancedResults);
});

// @desc Create new Bootcamp
// @route POST /api/v1/bootcamps
// @access Private
exports.createBootCamp = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  // res.status(200).json({ success: true, msg: "Create new bootcamp " });

  const bootcamp1 = await Bootcamp.create(req.body);
  console.log(bootcamp1);
  res.status(201).json({
    success: true,
    data: bootcamp1
  });
});

// @desc Update Bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private
exports.updateBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    msg: `Update bootcamp ${req.params.id}`,
    data: bootcamp
  });
});

// @desc Delete Bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private
exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  bootcamp.remove();
  res.status(200).json({
    success: true,
    msg: `delete bootcamp ${req.params.id}`,
    data: bootcamp
  });
});

// @desc Get Bootcamps within a radius
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/long from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;

  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide distance by radius of Earth
  // Radius of Earth = 3963 miles or 6378 Km
  const Radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], Radius] } }
  });

  console.log(bootcamps.length);

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});

// @desc upload photo for bootcamp
// @route PUT /api/v1/bootcamps/:id/photo
// @access Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id); // We want to find the specific bootcamp for which upload needs to be made

  if (!bootcamp) {
    // Secondly we want to check if the bootcamp exists or not
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  // We are going to check to see if a file is actually uploaded or not.
  if (!req.files) {
    return next(new ErrorResponse(`Please Upload a file`, 404));
  }

  const file = req.files.file;

  // Make sure the image is photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 404));
  }

  // Checking the file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        404
      )
    );
  }

  // Create Custome filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  // Actually the time to upload the file using the .mv method
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name
    });
  });
});
