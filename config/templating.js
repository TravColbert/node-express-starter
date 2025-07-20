const fs = require('fs')
const path = require('path')

module.exports = function (app) {
    app.set('view options', { compileDebug: false })

    let viewPaths = app.locals.appList.split(',').map(appInstance => {
        const viewPath = path.join(__dirname, app.locals.basePath, appInstance.trim(), app.locals.viewPath)
        if (fs.existsSync(viewPath)) {
            return viewPath
        }
        return null
    }).filter(viewPath => viewPath)

    if (fs.existsSync(path.join(__dirname, app.locals.basePath, app.locals.viewPath))) {
        viewPaths = viewPaths.concat(path.join(__dirname, app.locals.basePath, app.locals.viewPath))
    }

    if (fs.existsSync(path.join(__dirname, '..', app.locals.viewPath))) {
        viewPaths = viewPaths.concat(path.join(__dirname, '..', app.locals.viewPath))
    }

    app.set('views', viewPaths)

    app.set('view engine', 'pug')
}