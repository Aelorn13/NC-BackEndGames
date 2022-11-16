const db = require("../db/connection.js");
const { fetchUsers } = require("../models/users");
const { checkCategoryExists } = require("../utils/dbUtils");
exports.fetchReviews = (category, sort_by = "created_at", order = "DESC") => {
  const promiseArr = [];
  const validColumns = [
    "review_id",
    "title",
    "owner",
    "category",
    "review_img_url",
    "created_at",
    "votes",
    "designer",
    "comment_count",
  ];
  const validOrders = ["ASC", "DESC"];
  if (!validColumns.includes(sort_by.toLowerCase())) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }
  if (!validOrders.includes(order.toUpperCase())) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }
  const queryValues = [];

  let queryStr = `SELECT reviews.review_id, title, owner, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comments.comment_id) as comment_count
  FROM reviews
  LEFT JOIN  comments
  ON reviews.review_id = comments.review_Id`;
  if (category) {
    if (category.includes("+")) category = category.replace("+", " ");
    queryStr += " WHERE reviews.category = $1";
    queryValues.push(category);
    promiseArr[1] = checkCategoryExists(category);
  }
  queryStr += ` GROUP BY reviews.review_id ORDER BY ${sort_by} ${order}`;

  promiseArr[0] = db.query(queryStr, queryValues);

  return Promise.all(promiseArr).then((results) => {
    const reviews = results[0].rows;
    return reviews;
  });
};
exports.fetchReviewById = (review_id) => {
  return db
    .query(
      `SELECT reviews.review_id, title, review_body, owner, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comments.comment_id) as comment_count
    FROM reviews
    LEFT JOIN  comments
    ON reviews.review_id = comments.review_Id
    where reviews.review_Id= $1
    GROUP BY reviews.review_id;`,
      [review_id]
    )
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
exports.insertComment = (comment, review_id) => {
  const { username, body } = comment;
  if (!username || !body) {
    return Promise.reject({ status: 406, msg: "body misses required keys" });
  }
  return fetchUsers()
    .then((usersArr) => {
      let flag = false;
      for (const user of usersArr) {
        if (user.username === username) {
          flag = true;
          break;
        }
      }
      return flag;
    })
    .then((flag) => {
      if (flag === false) {
        return Promise.reject({ status: 406, msg: "this user does not exist" });
      } else {
        return db.query(
          `INSERT INTO comments(body, author, review_id) VALUES ($1, $2, $3) RETURNING *;`,
          [body, username, review_id]
        );
      }
    })
    .then((result) => {
      return result.rows[0];
    });
};
exports.updateReview = (change, review_id) => {
  if (!change || isNaN(change))
    return Promise.reject({ status: 406, msg: "body misses required keys" });
  return db
    .query(
      "UPDATE reviews set votes=votes+$1 WHERE review_id = $2 RETURNING*;",
      [change, review_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "review does not exist" });
      }
      return result.rows[0];
    });
};
