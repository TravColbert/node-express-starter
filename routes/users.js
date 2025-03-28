const express = require("express")
const router = express.Router({ mergeParams: true })
const path = require('path')

module.exports = function (app) {
  // Require the users controller
  const usersController = require(path.join(__dirname, '../', app.locals.controllerPath, 'users'))

  // A 'login' route for logging in
  router.route("/login")
    .get((req, res) => {
      usersController.login(req, res)
    })
    .post((req, res) => {
      usersController.authenticate(req, res)
    })

  // A 'logout' route for logging out
  router.route("/logout")
    .get((req, res) => {
      usersController.logout(req, res)
    })

  // A 'profile' route for showing a user's profile
  router.route("/profile")
    .get((req, res) => {
      usersController.profile(req, res)
    })

  // A '/' route for showing all users
  router.route("/")
    .get((req, res) => {
      usersController.index(req, res)
    })
    .post((req, res) => {
      usersController.create(req, res)
    })

  return router
}