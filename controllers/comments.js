const { removeCommentById, updateCommentById } = require("../models/comments");
exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
exports.patchCommentById = (req, res, next) => {
  const { inc_votes } = req.body;
  const { comment_id } = req.params;
  updateCommentById(inc_votes, comment_id)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
