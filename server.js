const expressServer = require("express");
const dotenv = require("dotenv");
const logger = require("./middlewares/logger");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error");
const color = require("colors");
const path = require("path");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

// Route files
const bootcamps = require("./routes/routesBootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");

const app = expressServer();

// Body parser
app.use(expressServer.json());

//Cookie parser
app.use(cookieParser());

// Already premade logger morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File uploading
app.use(fileupload());

// Set static folder
app.use(expressServer.static(path.join(__dirname, "public")));

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port  ${PORT}`.yellow
      .bold
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.essage}`);
  // Close server & exit process
  server.close(() => process.exit(1)); // Beacuse we want it to exit with failure we can pass a 1 to process.exit() function.
});
