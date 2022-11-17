const reviewsRouter = require("express").Router();
const {
  getReviews,
  getReviewById,
  getReviewCommentsById,
  postComment,
  patchReview,
} = require("../controllers/reviews.js");

reviewsRouter.route("/").get(getReviews);

reviewsRouter.route("/:review_id").get(getReviewById).patch(patchReview);
reviewsRouter
  .route("/:review_id/comments")
  .get(getReviewCommentsById)
  .post(postComment);

module.exports = reviewsRouter;
