const db = require("../db/connection.js");

exports.selectNews = () => {
  return db.query("SELECT * FROM topics;").then((topic) => {
    return topic.rows;
  });
};
