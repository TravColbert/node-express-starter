const { Sequelize } = require('sequelize')

/**
 * A default database config using SQLite for development.
 * In included, by default, in config/options.js
 * You can override this by setting the DATABASE_CONFIG environment variable
 * to a JSON string representing your desired Sequelize config.
 * You can do that in a string, .env, .json or in your deployment environment.
 */

module.exports = function (app) {
  app.locals.db = app.locals.databaseConfig ? new Sequelize(app.locals.databaseConfig) : false
}