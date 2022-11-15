const db = require("../db/connection.js");
exports.fetchReviews = () => {
  return db
    .query(
      `SELECT reviews.review_id, title, owner, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comments.comment_id) as comment_count
        FROM reviews
        LEFT JOIN  comments
        ON reviews.review_id = comments.review_Id
        GROUP BY reviews.review_id
        ORDER BY created_at DESC;`
    )
    .then((result) => {
      return result.rows;
    });
};
exports.fetchReviewById = (review_id) => {
  return db
    .query(`SELECT * FROM reviews where review_id = $1;`, [review_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "review does not exist" });
      }
      return result.rows[0];
    });
};

exports.fetchReviewCommentsById = (review_id) => {
  return this.fetchReviewById(review_id).then(() => {
    return db
      .query(
        `SELECT * FROM comments where review_id = $1 ORDER BY created_at;`,
        [review_id]
      )
      .then((result) => {
        return result.rows;
      });
  });
};
