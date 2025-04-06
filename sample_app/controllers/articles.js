'use strict'

module.exports = function (app) {
  return {
    index: function (req, res) {
      const articlesCollection = app.locals.models['articles'].all()
      res.render('articles/index', { articles: articlesCollection })
    }
  }
}