const {
  fetchReviews,
  fetchReviewById,
  fetchReviewCommentsById,
} = require("../models/reviews");

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
exports.getReviewCommentsById = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewCommentsById(review_id)
    .then((comments) => {
      res.send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
