const db = require("../db/connection.js");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((topic) => {
    return topic.rows;
  });
};
exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((articles) => {
      return articles.rows;
    });
};
exports.updateArticleById = (articleId, incVotes) => {
  const { article_id } = articleId;
  const { inc_votes } = incVotes;
  return db
    .query(
      `UPDATE articles SET votes = votes + $1  WHERE article_id = $2 RETURNING *;`,
      [inc_votes, article_id]
    )
    .then((articles) => {
      return articles.rows[0];
    });
};
