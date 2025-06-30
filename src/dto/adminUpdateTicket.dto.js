const { body } = require("express-validator");

exports.adminUpdateTicketDto = [
  body("title").optional().isString(),
  body("description").optional().isString(),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority"),
  body("status")
    .optional()
    .isIn(["open", "in-progress", "closed"])
    .withMessage("Invalid status"),
  body("supportId").optional().isMongoId().withMessage("Invalid supportId"),
];
