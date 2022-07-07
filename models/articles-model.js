const db = require("../db/connection.js");

//2.GET/articles/:article_id
exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.*, 
      CAST(COUNT(comments.article_id) AS INT) AS comment_count 
      FROM articles 
      LEFT JOIN comments ON articles.article_id = comments.article_id 
      WHERE articles.article_id = $1 GROUP BY articles.article_id;`,
      [article_id]
    )
    .then((articles) => {
      if (!articles.rows.length) {
        return Promise.reject({ status: 404, msg: "Invalid ID not found" });
      }
      return articles.rows[0];
    });
};

//9. GET /api/articles/:article_id/comments
exports.selectAllCommentsById = (article_id) => {
  // const { article_id } = articleId;

  return db
    .query(`SELECT * FROM comments WHERE article_id = $1;`, [article_id])
    .then((comments) => {
      if (!comments.rows.length) {
        return Promise.reject({ status: 404, msg: "Invalid ID not found" });
      }
      return comments.rows;
    });
};

//10. POST /api/articles/:article_id/comments
exports.insertNewCommentById = (postedComment, article_id) => {
  const { username: author, body } = postedComment;
  return db
    .query(
      `INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;`,
      [body, author, article_id.article_id]
    )
    .then((comments) => {
      if (!comments.rows.length) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
      }
      return comments.rows[0];
    });
};

//3.PATCH/articles
exports.updateArticleById = (articleId, incVotes) => {
  const { article_id } = articleId;
  const { inc_votes } = incVotes;

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

exports.selectAllArticles = ({
  sort_by = "created_at",
  order = "desc",
  topic,
}) => {
  const validSortBy = ["title", "author", "votes", "created_at"];
  const validOrder = ["asc", "desc"];
  const validTopic = [];

  let queryStr = `SELECT articles.*, 
  CAST(COUNT(comments.article_id) AS INT) AS comment_count 
  FROM articles 
  LEFT JOIN comments ON articles.article_id = comments.article_id `;

  if (topic) {
    queryStr += ` WHERE articles.topic = $1`;
    validTopic.push(topic);
  }

  if (validSortBy.includes(sort_by) && validOrder.includes(order)) {
    queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;
  } else {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  return db.query(queryStr, validTopic).then((articles) => {
    if (!articles.rows.length) {
      return Promise.reject({ status: 404, msg: "Invalid ID not found" });
    }
    return articles.rows;
  });
};
