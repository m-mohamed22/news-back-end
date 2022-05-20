const db = require("../db/connection.js");

//1.GET/topics
exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((topic) => {
    return topic.rows;
  });
};
