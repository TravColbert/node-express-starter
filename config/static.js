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
    /**
     * There might be additional, app-specific static locations.
     * This allows us to ask the app to configure its own static files.
     */
    const appConfig = path.join(__dirname, '../', appInstance.trim(), 'config', 'static.js')
    if (fs.existsSync(appConfig)) {
      require(appConfig)(app)
    }
  }

  // Finally, add the framework-wide static location
  const frameworkLocation = path.join(__dirname, '..', app.locals.publicPath)
  if (fs.existsSync(frameworkLocation)) {
    app.locals.debug && console.debug(`Configuring default static files location for: framework - ${frameworkLocation}`)
    app.use(express.static(frameworkLocation))
  }
}