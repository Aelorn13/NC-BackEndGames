const commentsRouter = require("express").Router();
const { deleteCommentById } = require("../controllers/comments.js");

commentsRouter.route("/:comment_id").delete(deleteCommentById);

module.exports = commentsRouter;
