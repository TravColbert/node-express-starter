const express = require("express");
const router = express.Router({ mergeParams: true });

module.exports = function (app) {
  // Turn off this route in production
  if (app.locals.nodeEnv === "production") return router;

  router.route("/test").get((_req, res, next) => {
    res.locals.render.template = "test";
    next();
  });

  // The default template is: "index"
  router.route("/").get((_req, res, next) => {
    next();
  });

  return router;
};
