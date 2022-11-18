const reviewsRouter = require("express").Router();
const {
  getReviews,
  getReviewById,
  getReviewCommentsById,
  postComment,
  patchReview,
  postReview,
  deleteReview,
} = require("../controllers/reviews.js");

reviewsRouter.route("/").get(getReviews).post(postReview);

reviewsRouter
  .route("/:review_id")
  .get(getReviewById)
  .patch(patchReview)
  .delete(deleteReview);
reviewsRouter
  .route("/:review_id/comments")
  .get(getReviewCommentsById)
  .post(postComment);

module.exports = reviewsRouter;
