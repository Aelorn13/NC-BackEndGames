const { fetchReviews } = require("../models/reviews");

exports.getReviews = (req, res) => {
  fetchReviews().then((reviews) => {
    res.send({ reviews });
  });
};
