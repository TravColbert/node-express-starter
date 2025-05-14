const fs = require("fs")
const path = require("path")
const express = require("express")

module.exports = function (app) {
  for (appInstance of app.locals.appList.split(',')) {
    const location = path.join(__dirname, '../', appInstance.trim(), app.locals.publicPath)
    if (fs.existsSync(location)) {
      app.locals.debug && console.debug(`Configuring default static files location for: ${appInstance} - ${location}`)
      app.use(express.static(location))
    }
    // load app-level config
    const appConfig = path.join(__dirname, '../', appInstance.trim(), 'config', 'static.js')
    if (fs.existsSync(appConfig)) {
      require(appConfig)(app)
    }
  }
}