const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    features: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      min: [0, "Rating must be at least 0"],
      max: [5, "Rating cannot exceed 5"],
    },

    name: {
      type: String,
      required: [true, "product name must be provided"],
      unique: true,
    },

    price: {
      type: Number,
      required: [true, "product price must be provided"],
    },

    company: {
      type: String,
      enum: {
        values: ["ikea", "liddy", "caressa", "marcos"],
        message: `{VALUE} is not supported`,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
