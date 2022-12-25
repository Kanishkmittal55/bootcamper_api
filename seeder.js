const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load env variables
dotenv.config({ path: "./config/config.env" });

// Load Models
const Bootcamp = require("./models/Bootcamp");

// Load Course Model
const Course = require("./models/Course");

// Load User Model
const User = require("./models/User");

const connectDB = require("./config/db");

// connect to DB
mongoose.connect(process.env.MONGO_URI);

// Read JSON FILE
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, `utf-8`)
);

// Reading the Model JSON File
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, `utf-8`)
);

// Reading the Model JSON File
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, `utf-8`)
);

// Import into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    // await Course.create(courses);
    console.log("Data Imported...".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Import Courses into DB
const importCourses = async () => {
  try {
    await Course.create(courses);
    console.log("Courses Imported...".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Import Users into DB
const importUsers = async () => {
  try {
    await User.create(users);
    console.log("Users Imported...".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete Data destroy data

const deleteData = async () => {
  try {
    await connectDB();
    await Bootcamp.deleteMany(); // If you dont pass anything to delete Many it will delete everything.

    console.log("Data Destroyed...".red.inverse);
    process.exit();
  } catch (error) {}
};

// Delete Courses into DB
const deleteCourses = async () => {
  try {
    // await connectDB();
    await Course.deleteMany();

    console.log("Courses Deleted...".red.inverse);
    process.exit();
  } catch (Err) {
    console.log(Err);
  }
};

// Delete User from DB
const deleteUsers = async () => {
  try {
    // await connectDB();
    await User.deleteMany();

    console.log("Courses Deleted...".red.inverse);
    process.exit();
  } catch (Err) {
    console.log(Err);
  }
};

try {
  if (process.argv[2] === "-ib") {
    importData();
  } else if (process.argv[2] === "-db") {
    deleteData();
  } else if (process.argv[2] === "-dc") {
    deleteCourses();
  } else if (process.argv[2] === "-ic") {
    importCourses();
  } else if (process.argv[2] === "-iu") {
    importUsers();
  } else if (process.argv[2] === "-du") {
    deleteUsers();
  } else {
    console.log("Erroneous Entry");
  }
} catch (error) {
  console.log(error);
}
