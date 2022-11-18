const db = require("../db/connection.js");

exports.fetchCategories = () => {
  return db.query("SELECT * FROM categories;").then((result) => {
    return result.rows;
  });
};

exports.insertCategories = (category) => {
  const { slug, description } = category;
  if (!slug || !description) {
    return Promise.reject({ status: 406, msg: "body misses required keys" });
  }
  return db
    .query(
      `INSERT INTO categories(slug, description) VALUES ($1, $2) RETURNING *;`,
      [slug, description]
    )
    .then((res) => {
      return res.rows[0];
    });
};
