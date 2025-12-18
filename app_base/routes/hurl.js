const express = require("express")
const router = express.Router({ mergeParams: true })

module.exports = function (app) {
  // Turn off this route in production
  if (app.locals.nodeEnv === "production") return router

  router.route("/")
    .all((_req, _res) => {
      /**
       * fire an error event
       */
      app.emit("error", new Error("Intentionally thrown error"))
    })

  return router
}