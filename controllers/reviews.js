const {
  fetchReviews,
  fetchReviewById,
  fetchReviewCommentsById,
  insertComment,
  updateReview,
  insertReview,
  removeReviewById,
} = require("../models/reviews");

exports.getReviews = (req, res, next) => {
  const { category, sort_by, order, limit, p } = req.query;
  fetchReviews(category, sort_by, order, limit, p)
    .then((reviews) => {
      res.send({ reviews });
    })
    .catch((err) => {
      next(err);
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
  const { limit, p } = req.query;
  fetchReviewCommentsById(review_id, limit, p)
    .then((comments) => {
      res.send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
exports.postComment = (req, res, next) => {
  const comment = req.body;
  const { review_id } = req.params;

  insertComment(comment, review_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
exports.patchReview = (req, res, next) => {
  const { inc_votes } = req.body;
  const { review_id } = req.params;
  updateReview(inc_votes, review_id)
    .then((review) => {
      res.status(200).send({ review: review });
    })
    .catch((err) => {
      next(err);
    });
};
exports.postReview = (req, res, next) => {
  const review = req.body;
  insertReview(review)
    .then((review) => {
      res.status(201).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
exports.deleteReview = (req, res, next) => {
  const { review_id } = req.params;
  removeReviewById(review_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
