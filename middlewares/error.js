const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  console.log("The error is :");
  console.log(err);

  error.message = err.message;

  console.log("Error middle ware ran");

  // Log to Console for dev
  console.log(err.stack.red);
  console.log("Err.errors");
  //   console.log(err.errors.name.key());
  //   console.log(err === "ValidationError");
  console.log("Err.keyvalue");
  //   console.log(err.keyValue.name);
  // Using the properties associated with the error object

  // Mongoose wrongly formatted ObjectId
  // So if the err.name === CastError , what we want to do
  if (err.name === "CastError") {
    const message = `The id ${err.value} is improperly formatted please recheck and type the correct id to continue.`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate objects code which you need to check just about every time.
  if (err.code === 11000) {
    const message2 = `Duplicate value detected "${err.keyValue.name}" already exists`;
    error = new ErrorResponse(message2, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error"
  });
};

module.exports = errorHandler;
