const db = require("../db/connection.js");
const { checkCategoryExists, checkUserExists } = require("../utils/dbUtils");
exports.fetchReviews = (
  category,
  sort_by = "created_at",
  order = "DESC",
  limit = 10,
  p = 0
) => {
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
  if (isNaN(limit) || isNaN(p)) {
    return Promise.reject({ status: 400, msg: "Invalid limit or page query" });
  }
  if (!validColumns.includes(sort_by.toLowerCase())) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }
  if (!validOrders.includes(order.toUpperCase())) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }
  const queryValues = [];
  let countQueryStr = `(SELECT count(*) :: INT AS total_count FROM reviews)`;
  let queryStr = `SELECT reviews.review_id, title, owner, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comments.comment_id) :: INT AS comment_count, ${countQueryStr}
  FROM reviews
  LEFT JOIN  comments
  ON reviews.review_id = comments.review_Id`;
  if (category) {
    if (category.includes("+")) category = category.replace("+", " ");
    countQueryStr =
      "(SELECT count(*) :: INT AS total_count FROM reviews where reviews.category = $1)";
    queryStr = `SELECT reviews.review_id, title, owner, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comments.comment_id) :: INT AS comment_count, ${countQueryStr}
    FROM reviews
    LEFT JOIN  comments
    ON reviews.review_id = comments.review_Id WHERE reviews.category = $1`;
    queryValues.push(category);
    promiseArr[1] = checkCategoryExists(category);
  }
  queryStr += ` GROUP BY reviews.review_id ORDER BY ${sort_by} ${order}
  LIMIT ${limit} OFFSET ${limit * p}`;
  promiseArr[0] = db.query(queryStr, queryValues);
  return Promise.all(promiseArr).then((results) => {
    const reviews = results[0].rows;
    return reviews;
  });
};
exports.fetchReviewById = (review_id) => {
  return db
    .query(
      `SELECT reviews.review_id, title, review_body, owner, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comments.comment_id) :: INT AS comment_count
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
exports.fetchReviewCommentsById = (review_id, limit = 10, p = 0) => {
  if (isNaN(limit) || isNaN(p)) {
    return Promise.reject({ status: 400, msg: "Invalid limit or page query" });
  }
  return this.fetchReviewById(review_id).then(() => {
    return db
      .query(
        `SELECT * FROM comments where review_id = $1 ORDER BY created_at LIMIT ${limit} OFFSET ${
          limit * p
        };`,
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
  return checkUserExists(username)
    .then(() => {
      return db.query(
        `INSERT INTO comments(body, author, review_id) VALUES ($1, $2, $3) RETURNING *;`,
        [body, username, review_id]
      );
    })
    .then((res) => {
      return res.rows[0];
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
exports.insertReview = (review) => {
  const { title, owner, review_body, designer, category } = review;
  if (!title || !owner || !review_body || !designer || !category) {
    return Promise.reject({ status: 406, msg: "body misses required keys" });
  }
  const promiseArr = [];
  const queryInsertStr =
    "INSERT INTO reviews(title, owner, review_body, designer, category) VALUES ($1, $2, $3, $4, $5) RETURNING *;";
  const queryInsertValues = [title, owner, review_body, designer, category];

  promiseArr.push(checkUserExists(owner));
  promiseArr.push(checkCategoryExists(category));
  return Promise.all(promiseArr)
    .then(() => {
      return db.query(queryInsertStr, queryInsertValues);
    })
    .then((results) => {
      return results.rows[0].review_id;
    })
    .then((review_id) => {
      return this.fetchReviewById(review_id);
    });
};
exports.removeReviewById = (review_id) => {
  return db
    .query("DELETE FROM comments WHERE review_id = $1 RETURNING *;", [
      review_id,
    ])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "review does not exist" });
      }
    })
    .then(() => {
      return db.query("DELETE FROM REVIEWS WHERE review_id = $1 RETURNING *;", [
        review_id,
      ]);
    });
};
