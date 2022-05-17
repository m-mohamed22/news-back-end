const express = require("express");
const app = express();

const { getTopics, getArticleById } = require("./controllers/news-controller");

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Error, path not found" });
});

module.exports = app;
