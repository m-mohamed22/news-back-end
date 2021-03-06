const {
  selectArticleById,
  updateArticleById,
  selectAllArticles,
  selectAllCommentsById,
  insertNewCommentById,
  removeCommentById,
} = require("../models/articles-model.js");

exports.getAllArticles = (req, res, next) => {
  // const { sort_by } = req.query;
  selectAllArticles(req.query)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  selectAllCommentsById(article_id)
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postNewCommentById = (req, res, next) => {
  const { body: postedComment, params: article_id } = req;
  insertNewCommentById(postedComment, article_id)
    .then((newCommentPost) => {
      res.status(201).send({ newCommentPost: newCommentPost });
    })
    .catch((err) => {
      console.log(err, "<< controller");
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  updateArticleById(req.params, req.body)
    .then((updatedArticle) => {
      res.status(200).send({ article: updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then((result) => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
