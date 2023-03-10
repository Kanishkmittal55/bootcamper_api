const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const geocoder = require("../utils/geocoder");
const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");

// @desc GET courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    // if this i.e. /api/v1/bootcamps/:bootcampId/courses route is hit
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    // Beacuse we are not going to return all the features like pagination and stuff if we are just getting the courses for a specific bootcamp, we only
    // want to use it when we are getting all the courses
    // So this part has separate and different response.
    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
    // So that for a specific bootcamp
  } else {
    // if this i.e. /ape/v1/courses route is hit get all courses
    res.status(200).json(res.advancedResults);
    // same thing we did for Bootcamp
  }
});

// @desc GET courses
// @route GET /api/v1/courses/:id
// @access Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description"
  });

  if (!course) {
    return next(
      new ErrorResponse(`No Course with id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc Add courses
// @route POST /api/v1/bootcamps/:bootcampId/courses
// @access Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with id of ${req.params.bootcampId}`),
      404
    );
  }

  // First we make sure that the bootcamp owner is the person that's logged in
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a course to ${bootcamp._id}.`
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc Update courses
// @route PUT /api/v1/courses/:id
// @access Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with id of ${req.params.id}`),
      404
    );
  }

  // First we make sure that the bootcamp owner is the person that's logged in , make sure User is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update course to ${course._id}.`
      )
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc Delete courses
// @route DELETE /api/v1/courses/:id
// @access Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with id of ${req.params.id}`),
      404
    );
  }

  // First we make sure that the bootcamp owner is the person that's logged in , make sure User is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete course to ${course._id}.`
      )
    );
  }

  await course.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
