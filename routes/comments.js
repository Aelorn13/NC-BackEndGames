const commentsRouter = require("express").Router();
const {
  deleteCommentById,
  patchCommentById,
} = require("../controllers/comments.js");

commentsRouter
  .route("/:comment_id")
  .delete(deleteCommentById)
  .patch(patchCommentById);

module.exports = commentsRouter;
