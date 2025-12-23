const { Sequelize } = require('sequelize')

module.exports = function (app) {
  app.locals.db = app.locals.databaseConfig ? new Sequelize(app.locals.databaseConfig) : false
}