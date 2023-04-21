const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  updateUserAvatar,
  updateUserName,
} = require("../controllers/userController");
const protect = require("../middlewares/authMiddleware");
const { validateRequest } = require("../validation/validateRequest");
const {
  registerUserValidations,
  authUserValidations,
  updateUserValidation,
} = require("../validation/userValidations");
const multer = require("multer");
const upload = multer();

const router = express.Router();

router.post(
  "/",
  upload.single("pictureFile"),
  validateRequest(registerUserValidations),
  registerUser
);
router.post("/login", validateRequest(authUserValidations), authUser);
router.get("/", protect, allUsers);
router.put("/image", protect, upload.single("pictureFile"), updateUserAvatar);
router.put("/update", protect, authUserValidations, updateUserName);

module.exports = router;
