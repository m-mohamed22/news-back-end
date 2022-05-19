const db = require("../db/connection.js");

//1.GET/topics
exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((topic) => {
    return topic.rows;
  });
};

//2.GET/articles
exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((articles) => {
      if (!articles.rows.length) {
        return Promise.reject({ status: 404, msg: "Invalid ID not found" });
      }
      return articles.rows[0];
    });
};

//3.PATCH/articles
exports.updateArticleById = (articleId, incVotes) => {
  const { article_id } = articleId;
  const { inc_votes } = incVotes;

  // if (!inc_votes) {
  //   return Promise.reject({ status: 400, msg: "Bad Request" });
  // }
  return db
    .query(
      `UPDATE articles SET votes = votes + $1  WHERE article_id = $2 RETURNING *;`,
      [inc_votes, article_id]
    )
    .then((articles) => {
      if (!articles.rows.length) {
        return Promise.reject({
          status: 404,
          msg: `Article ID ${article_id} does not exist`,
        });
      } else if (!inc_votes) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
      }

      return articles.rows[0];
    });
};
