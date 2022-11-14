const express = require("express");
const { getCategories } = require("./controllers/categories.js");

app.get("/api/categories", getCategories);

module.exports = app;
