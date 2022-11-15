const { fetchReviews, fetchReviewById } = require("../models/reviews");

exports.getReviews = (req, res) => {
  fetchReviews().then((reviews) => {
    res.send({ reviews });
  });
};
exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewById(review_id)
    .then((review) => {
      res.send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
