const express = require("express")
const router = express.Router({ mergeParams: true })
const path = require('path')

module.exports = function (app) {
  // Turn off this route in production
  if (app.locals.nodeEnv === "production") return router

  const currentRouteName = path.basename(__filename, '.js')

  // Require the controller with the same name as the router
  const controller = require(path.join('../', app.locals.controllerPath, currentRouteName))(app)

  router.route("/")
    .get(controller.cacheTest)

  return router
}