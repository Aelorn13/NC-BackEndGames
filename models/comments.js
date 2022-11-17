const db = require("../db/connection.js");
exports.removeCommentById = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [
      comment_id,
    ])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comment does not exist" });
      }
      return;
    });
};
exports.updateCommentById = (change, comment_id) => {
  if (!change || isNaN(change))
    return Promise.reject({ status: 406, msg: "body misses required keys" });
  return db
    .query(
      "UPDATE comments set votes=votes+$1 WHERE comment_id = $2 RETURNING*;",
      [change, comment_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comment does not exist" });
      }
      return result.rows[0];
    });
};
