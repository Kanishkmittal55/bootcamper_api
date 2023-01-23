const expressRouterInstance = require("express");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/users");

const User = require("../models/User");
const router = expressRouterInstance.Router({ mergeParams: true });

const advancedResults = require("../middlewares/advancedResults");
const { protect, authorize } = require("../middlewares/auth"); // We get the protect function directly

router.use(protect); // Anything below this will this middleware
router.use(authorize("admin")); // same function offered as before

router.route("/").get(advancedResults(User), getUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
