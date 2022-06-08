const express = require("express");

const { getTopics } = require("./controllers/topics-controller");

const {
  getArticleById,
  patchArticleById,
  getAllArticles,
  getAllCommentsById,
  postNewCommentById,
} = require("./controllers/articles-controller");

const { getUsers } = require("./controllers/users-controller ");

const app = express();
app.use(express.json());

/***topics***/
app.get("/api/topics", getTopics);

/***articles***/
app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getAllCommentsById);

app.post("/api/articles/:article_id/comments", postNewCommentById);

app.patch("/api/articles/:article_id", patchArticleById);

/***users***/
app.get("/api/users", getUsers);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Error, path not found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    return res.status(400).send({ msg: "Bad Request" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
});

app.use((err, req, res, next) => {
  // console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
