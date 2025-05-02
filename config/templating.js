const path = require('path')

module.exports = function (app) {
    app.set('view options', { compileDebug: false })
    app.set('views', path.join(__dirname, '/..', app.locals.appPath, app.locals.viewPath))
    app.set('view engine', 'pug')
}