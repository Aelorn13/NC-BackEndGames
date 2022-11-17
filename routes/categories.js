const categoryRouter = require("express").Router();
const { getCategories } = require("../controllers/categories.js");

categoryRouter.route("/").get(getCategories);

module.exports = categoryRouter;
