const { selectNews } = require("../models/news-model.js");

exports.getTopics = (req, res, next) => {
  selectNews()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};
