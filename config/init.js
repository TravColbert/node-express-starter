const helmet = require("helmet")
const bodyParser = require('body-parser')

module.exports = function (app) {
  app.use(helmet())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
}