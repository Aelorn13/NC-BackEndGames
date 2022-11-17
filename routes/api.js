const apiRouter = require("express").Router();
const categoryRouter = require("./categories");
const reviewRouter = require("./reviews");
const usersRouter = require("./users");
const commentsRouter = require("./comments");
const { getApi } = require("../controllers/api.js");

apiRouter.get("/", getApi);
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/reviews", reviewRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
