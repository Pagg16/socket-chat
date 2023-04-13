const { body } = require("express-validator");

const registerUserValidations = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 4, max: 30 })
    .withMessage("Password must be between  and 30 characters long"),
];

const authUserValidations = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 4, max: 30 })
    .withMessage("Password must be between 4 and 30 characters long"),
];

module.exports = {
  registerUserValidations,
  authUserValidations,
};
