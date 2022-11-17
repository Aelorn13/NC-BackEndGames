const usersRouter = require("express").Router();
const { getUsers } = require("../controllers/users.js");

usersRouter.route("/").get(getUsers);

module.exports = usersRouter;
