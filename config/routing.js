const fs = require('fs')
const path = require('path')

module.exports = function (app) {
    for (const appInstance of app.locals.appList.split(',')) {
        const routerPath = path.join(__dirname, '../', appInstance.trim(), app.locals.routerPath)

        if (fs.existsSync(routerPath)) {
            // Get all .js files from router path
            const routerFiles = fs.readdirSync(routerPath)
                .filter(file => file.endsWith('.js'))
                .filter(file => file !== 'index.js') // Exclude index.js

            app.use((req, res, next) => {
                // Set the current path in the request object
                req.currentPath = req.path
                res.locals.render = {}
                next()
            })

            // Load and mount each router
            routerFiles.forEach(file => {
                const routeName = path.parse(file).name
                app.locals.debug && console.debug(`Mounting router: ${routeName}`)
                const router = require(path.join(routerPath, file))(app)
                app.use(`/${routeName}`, router)
            })
        }
    }

    /**
     * Mount the index router
     * This is the default router that handles the root path
     * The default router will be the first app instance with a router folder and an index.js file
     */
    for (const appInstance of app.locals.appList.split(',')) {
        const routerPath = path.join(__dirname, '../', appInstance.trim(), app.locals.routerPath, "index.js")
        if (fs.existsSync(routerPath)) {
            app.locals.debug && console.debug(`Mounting index (/) route from ${appInstance.trim()}`)
            const indexRouter = require(routerPath)(app)
            app.use('/', indexRouter)
            break
        }
    }

    /**
     * If the express app has no "/" route then render the home page view
     */
    if (!app._router.stack.some(r => r.route && r.route.path === '/' && r.route.methods.get)) {
        app.locals.debug && console.debug(`No "/" route found, seeking default home view...`)
        // Check each app instance for a home view
        for (const appInstance of app.locals.appList.split(',')) {
            const viewPath = path.join(__dirname, '../', appInstance.trim(), app.locals.viewPath, "home.pug")
            if (fs.existsSync(viewPath)) {
                app.locals.debug && console.debug(`Mounting ${viewPath} as home view`)
                app.get('/', (_req, res) => {
                    res.render(viewPath, { title: 'Home' })
                })
                break
            }
        }
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
