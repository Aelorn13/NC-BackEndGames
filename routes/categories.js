const categoryRouter = require("express").Router();
const {
  getCategories,
  postCategories,
} = require("../controllers/categories.js");

categoryRouter.route("/").get(getCategories).post(postCategories);

module.exports = categoryRouter;
