const express = require("express");
const { getCategories } = require("./controllers/categories.js");
const { getReviews } = require("./controllers/reviews.js");
const app = express();

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});
module.exports = app;
