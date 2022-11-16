const db = require("../db/connection.js");

exports.checkCategoryExists = (categorySlug) => {
  return db
    .query(`SELECT * FROM CATEGORIES WHERE SLUG = $1`, [categorySlug])
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "category not exist" });
      }
    });
};
