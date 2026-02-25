const { body } = require("express-validator");

exports.createBudgetValidator = [
  body("sector").notEmpty().withMessage("Sector is required"),

  body("allocatedAmount")
    .isFloat({ min: 0 })
    .withMessage("Allocated amount must be a positive number"),

  body("year").isInt({ min: 2000 }).withMessage("Year must be 2000 or later"),

  body("region")
    .notEmpty()
    .withMessage("Region is required")
    .isMongoId()
    .withMessage("Invalid region ID"),
];

exports.updateBudgetValidator = [
  body("sector").optional().notEmpty().withMessage("Sector cannot be empty"),

  body("allocatedAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Allocated amount must be positive"),

  body("year").optional().isInt({ min: 2000 }).withMessage("Invalid year"),

  body("region").optional().isMongoId().withMessage("Invalid region ID"),
];
