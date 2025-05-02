const fs = require("fs")
const path = require("path")
const express = require("express")

module.exports = function (app) {
  for (appInstance of app.locals.appList.split(',')) {
    const location = path.join(__dirname, '../', appInstance.trim(), app.locals.publicPath)
    if (fs.existsSync(location)) {
      console.debug(`Configuring default static files location for: ${appInstance} - ${location}`)
      app.use(express.static(location))
    }
  }
}