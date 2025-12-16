const express = require("express")
const router = express.Router({ mergeParams: true })

module.exports = function (app) {
  // Turn off this route in production
  if (app.locals.nodeEnv === "production") return router

  router.route("/test")
    .get((_req, res) => res.render("test"))

  router.route("/")
    .get((_req, res) => res.render("home"))

  return router
}