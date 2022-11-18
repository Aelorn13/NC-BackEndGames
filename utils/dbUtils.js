const { use } = require("../app.js");
const db = require("../db/connection.js");

exports.checkCategoryExists = (categorySlug) => {
  return db
    .query(`SELECT * FROM CATEGORIES WHERE SLUG = $1`, [categorySlug])
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "category does not exist" });
      }
    });
};

exports.checkUserExists = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User does not exist" });
      }
    });
};
