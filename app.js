const express = require("express");
const mongoose = require("mongoose");
const hpp = require("hpp");
const databaseConnection = require("./db/connect");

require("dotenv").config();

const { notFound } = require("./middleware/not-found");
const { globalError } = require("./middleware/error-handler");

const productsRouter = require("./routes/productsRoute");

// Connect to the database
databaseConnection();

const app = express();
//Middleware
app.use(express.json({ limit: "10kb" }));
app.use(hpp());
// routes
app.get("/", (req, res) => {
  res.send("<h1> Store API </h1><a href='/api/v1/products'>Go to Products</a>");
});
app.use("/api/v1/products", productsRouter);

// Handle unmatched routes
app.all("*", notFound);

// Global error handling middleware for express
app.use(globalError);

// Set up server to listen on specified port
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`server running in port ${port}`);
});
