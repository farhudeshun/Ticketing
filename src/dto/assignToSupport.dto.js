const { param, body } = require("express-validator");

exports.assignToSupportDto = [
  param("ticketId").isMongoId().withMessage("Invalid ticket ID"),
  body("supportId").notEmpty().isMongoId().withMessage("Invalid supportId"),
];
