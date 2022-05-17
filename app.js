const express = require("express");
const app = express();

const { getTopics } = require("./controllers/news-controller");

app.get("/api/topics", getTopics);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Error, path not found" });
});

module.exports = app;
