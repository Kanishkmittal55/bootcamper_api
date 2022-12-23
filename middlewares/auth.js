const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    let temp = req.headers.authorization.split(" ");
    // You can also directly write like so -
    // token = req.headers.authorization.split(' ')[1]
    token = temp[1];
  }
  //    else if (req.cookies.token) {
  //     token = req.cookies.token;
  //   }

  // Make sure its actually sent or make sure token exists whether its through the cookies or authorization
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});
