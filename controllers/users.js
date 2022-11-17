const { fetchUsers, fetchUserByUsername } = require("../models/users");
exports.getUsers = (req, res) => {
  fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
};
exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUserByUsername(username)
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      next(err);
    });
};
