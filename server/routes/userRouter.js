const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userController");
const protect = require("../middlewares/authMiddleware");
const { validateRequest } = require("../validation/validateRequest");
const {
  registerUserValidations,
  authUserValidations,
} = require("../validation/userValidations");
const multer = require("multer");
const upload = multer();

const router = express.Router();

router.post(
  "/",
  upload.none(),
  validateRequest(registerUserValidations),
  registerUser
);
router.post("/login", validateRequest(authUserValidations), authUser);
router.get("/", protect, allUsers);

module.exports = router;
