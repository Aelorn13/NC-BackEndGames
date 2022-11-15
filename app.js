const express = require("express");
const { getCategories } = require("./controllers/categories.js");
const { getReviews, getReviewById } = require("./controllers/reviews.js");
const app = express();

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);

app.use((err, req, res, next) => {
  if (err.code === "22P02") res.status(400).send({ msg: "Invalid id" });
  else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});
module.exports = app;
