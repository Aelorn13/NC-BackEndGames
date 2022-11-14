const express = require("express");
const { getCategories, getReviews } = require("./controllers/categories.js");
const app = express();

app.get("/api/categories", getCategories);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});
module.exports = app;
