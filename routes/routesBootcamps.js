const expressRouterInstance = require("express");

const {
  getBootCamp,
  getAllBootCamps,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
  getBootcampsInRadius,
  bootcampPhotoUpload
} = require("../controllers/bootcamps");

const Bootcamp1 = require("../models/Bootcamp");
const advancedResults = require("../middlewares/advancedResults");

// Inlcude other resource routers
const courseRouter = require("./courses");

const router = expressRouterInstance.Router();

const { protect } = require("../middlewares/auth"); // We get the protect function directly

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router
  .route("/")
  .get(advancedResults(Bootcamp1, "courses"), getAllBootCamps)
  .post(protect, createBootCamp); // where we put protect in the protected there the user has to be logged in

router.route("/:id/photo").put(protect, bootcampPhotoUpload); // where we put protect in the protected there the user has to be logged in

router
  .route("/:id")
  .get(getBootCamp)
  .put(protect, updateBootCamp)
  .delete(protect, deleteBootCamp); // where we put protect in the protected there the user has to be logged in
module.exports = router;
