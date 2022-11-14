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
