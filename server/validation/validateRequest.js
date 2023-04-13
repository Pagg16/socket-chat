const { validationResult, body } = require("express-validator");

function validateRequest(validations) {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));
    next();
  };
}

module.exports = {
  validateRequest,
};
