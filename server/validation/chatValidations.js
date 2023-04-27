const { body } = require("express-validator");

const chatUpdateNameValidations = [
  body("chatId").notEmpty().withMessage("ChatId is required"),
  body("chatName")
    .notEmpty()
    .isLength({ min: 2, max: 30 })
    .withMessage("Name is required and must be between 2 and 30 characters"),
];

const chatRemoveUserValidations = [
  body("chatId").notEmpty().withMessage("ChatId is required"),
  body("userId").notEmpty().withMessage("UserId is required"),
];

module.exports = {
  chatUpdateNameValidations,
  chatRemoveUserValidations,
};
