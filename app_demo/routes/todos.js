const express = require("express")
const router = express.Router({ mergeParams: true })
const path = require('path')

module.exports = function (app) {
  // Turn off this route in production
  if (app.locals.nodeEnv === "production") return router

  const currentRouteName = path.basename(__filename, '.js')

  // Require the controller with the same name as the router
  const controller = require(path.join(__dirname, '../', app.locals.controllerPath, currentRouteName))(app)

  router.route("/:id/completed")
    .get((req, res) => {
      return controller.markCompleted(req, res)
    })

  router.route("/:id/edit")
    .get((req, res) => {
      return controller.edit(req, res)
    })

  router.route("/new")
    .get((req, res) => {
      return controller.new(req, res)
    })

  router.route("/:id")
    .get((req, res) => {
      return controller.show(req, res)
    })
    .put((req, res) => {
      return controller.update(req, res)
    })
    .patch((req, res) => {
      return controller.update(req, res)
    })
    .delete((req, res) => {
      return controller.destroy(req, res)
    })

  router.route("/")
    .get((req, res) => {
      return controller.index(req, res)
    })
    .post((req, res) => {
      return controller.create(req, res)
    })

  return router;
}