const express = require("express");
const apiRouter = require("./routes/api");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

app.get("/api/health", (req, res) => {
  res.status(200).send({ msg: "server up and running" });
});

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});
app.use((err, req, res, next) => {
  if (err.code === "22P02") res.status(400).send({ msg: "Invalid id" });
  else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  if (err.status && err.msg) res.status(err.status).send({ msg: err.msg });
  else next(err);
});
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send();
});
module.exports = app;
