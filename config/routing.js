const fs = require('fs')
const path = require('path')

module.exports = function (app) {
    // Get all .js files from router path
    const routerPath = path.join(__dirname, '/..', app.locals.appPath, app.locals.routerPath)
    const routerFiles = fs.readdirSync(routerPath)
        .filter(file => file.endsWith('.js'))
        .filter(file => file !== 'index.js') // Exclude index.js

    // Load and mount each router
    routerFiles.forEach(file => {
        const routeName = path.parse(file).name
        app.locals.debug && console.debug(`Mounting router: ${routeName}`)
        const router = require(path.join(routerPath, file))(app)
        app.use(`/${routeName}`, router)
    })

    /**
     * Mount the index router
     * This is the default router that handles the root path
     */
    const indexRouterPath = path.join(routerPath, 'index.js')
    if (fs.existsSync(indexRouterPath)) {
        app.locals.debug && console.debug(`Mounting router: index`)
        const indexRouter = require(path.join(routerPath, 'index'))(app)
        app.use('/', indexRouter)
    }

    /**
     * Default error handling
     */
    app.use((err, _req, res, _next) => {
        console.dir(err.message)
        var errorMessage = {
            message: err.message
        }
        if (app.locals.debug) {
            console.dir(err.stack)
            errorMessage.stack = err.stack
        }
        res.status(500).render('errors/500', { error: errorMessage })
    })

    /**
     * 404 not found route
     */
    app.use((_req, res) => {
        res.status(404).render('errors/404')
    })
}
