const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");

const ApiFeature = require("../utilis/apiFeatures");

exports.getAllProducts = asyncHandler(async (req, res, next) => {
  //1) Filteration
  console.log(req.query);
  const queryObject = { ...req.query };

  const execludeFields = ["page", "limit", "sort", "fields", "keyword"];

  execludeFields.forEach((field) => delete queryObject[field]);

  let queryStr = JSON.stringify(queryObject);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  //  { price: { gte: '10' } }
  //  { price: { $gte: '10' } }

  //2) pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  //3) mongoose query
  let query = Product.find(JSON.parse(queryStr)).skip(skip).limit(limit);

  //4) sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  //5) limit field
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");

    query = query.select(fields);
  } else {
    query = query.select("-__v");
  }

  //8) search
  if (req.query.keyword) {
    const searchQuery = { name: { $regex: req.query.keyword, $options: "i" } };
    query = query.find(searchQuery);
  }

  //7) Execute the query
  const products = await query;
  // const apiFeature = new ApiFeature(req.query, Product.find())
  //   .filter()
  //   .paginate()
  //   .sort()
  //   .limitField()
  //   .search();

  // const { query } = apiFeature;
  // const products = await query;
  res
    .status(200)
    .json({ status: "success", data: products, nbHits: products.length });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findOne({ name: req.body.name });
  res.status(200).json({ status: "success", data: product });
});

exports.createProduct = asyncHandler(async (req, res, next) => {
  const { features, rating, name, price, company } = req.body;

  // Create a new product with the provided data
  const product = await Product.create({
    features,
    rating,
    name,
    price,
    company,
  });

  res.status(201).json({ success: "success", data: product });
});
