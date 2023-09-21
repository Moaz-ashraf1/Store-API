const { check } = require("express-validator");

const vaildatorMiddleware = require("../../middleware/validatorMiddleware");

const Product = require("../../models/productModel");

exports.createProductVaildator = [
  check("name")
    .notEmpty()
    .withMessage("product name must be provided")
    .isLength({ min: 3 })
    .withMessage("To short product name")
    .custom(async (value, { req }) => {
      const product = await Product.findOne({ name: value });
      if (product) {
        throw new Error("Product name must be unique");
      }
      return true; // Return true if the product doesn't exist
    }),

  check("rating")
    .notEmpty()
    .withMessage("Product rating must be provided")
    .isLength({ min: 0, max: 5 })
    .withMessage("Product rating must be between 0 and 5"),

  check("company").notEmpty().withMessage("product company must be provided"),

  vaildatorMiddleware,
];
