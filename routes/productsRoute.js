const express = require("express");

const router = express.Router();
const {
  getAllProducts,
  getAllProductsStatic,
  createProduct,
} = require("../controllers/productsController");

const {
  createProductVaildator,
} = require("../utilis/vaildators/productVaildator");
router.route("/").get(getAllProducts);

router.route("/").post(createProductVaildator, createProduct);

module.exports = router;
