const { fetchCategories, insertCategories } = require("../models/categories");

exports.getCategories = (req, res) => {
  fetchCategories().then((categories) => {
    res.send({ categories });
  });
};
exports.postCategories = (req, res, next) => {
  const category = req.body;
  insertCategories(category)
    .then((category) => {
      res.status(201).send({ category });
    })
    .catch((err) => {
      next(err);
    });
};
