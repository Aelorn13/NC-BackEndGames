const express = require("express");
const { getCategories } = require("./controllers/categories.js");
const { getUsers } = require("./controllers/users.js");
const {
  getReviews,
  getReviewById,
  getReviewCommentsById,
  postComment,
  patchReview,
} = require("./controllers/reviews.js");
const app = express();
app.use(express.json());
app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getReviewCommentsById);
app.post("/api/reviews/:review_id/comments", postComment);
app.get("/api/users", getUsers);
app.patch("/api/reviews/:review_id", patchReview);
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
