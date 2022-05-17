const express = require("express");

const {
  getTopics,
  getArticleById,
  patchArticleById,
} = require("./controllers/news-controller");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", patchArticleById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Error, path not found" });
});

module.exports = app;
