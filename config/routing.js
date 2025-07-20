const fs = require('fs')
const path = require('path')


module.exports = function (app) {
    app.locals.debug && console.debug('ℹ️\tSetting up routes')

    const setRenderObject = function (req, res, next) {
        res.locals.render = {}
        return next()
    }

    const detectHtmxRequest = function (req, res, next) {
        app.locals.debug && console.debug('Detecting HTMX request')
        // check for htmx request
        if (!req.headers['hx-request']) {
            res.locals.fullPage = true
        }
        return next()
    }

    const setAppName = function (req, res, next) {
        app.locals.debug && console.debug('Setting appName')
        res.locals.render.appName = app.locals.appName || pkg?.name || 'Node.js Express Mongoose Starter'
        return next()
    }

    const setAppLang = function (req, res, next) {
        app.locals.debug && console.debug(`Setting appLang: ${app.locals.lang}`)
        res.locals.render.lang = app.locals.lang || 'en'
        return next()
    }

    app.use([setRenderObject, setAppLang, setAppName, detectHtmxRequest])

    for (const appInstance of app.locals.appList.split(',')) {
        const routerPath = path.join(__dirname, app.locals.basePath, appInstance.trim(), app.locals.routerPath)

        app.locals.debug && console.debug(`\tChecking router path: ${routerPath}...`)

        if (fs.existsSync(routerPath)) {
            // Get all .js files from router path
            const routerFiles = fs.readdirSync(routerPath)
                .filter(file => file.endsWith('.js'))
                .filter(file => file !== 'index.js') // Exclude index.js

            app.use((req, res, next) => {
                // Set the current path in the request object
                req.currentPath = req.path
                next()
            })

            // Load and mount each router
            routerFiles.forEach(file => {
                const routeName = path.parse(file).name
                app.locals.debug && console.debug(`Mounting router: ${routeName}`)
                const router = require(path.join(routerPath, file))(app, appInstance.trim())
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
        const routerPath = path.join(__dirname, app.locals.basePath, appInstance.trim(), app.locals.routerPath, "index.js")
        if (fs.existsSync(routerPath)) {
            app.locals.debug && console.debug(`Mounting index (/) route from ${appInstance.trim()}`)
            const indexRouter = require(routerPath)(app, appInstance.trim())
            app.use('/', indexRouter)
            break
        }
    }

    /**
     * If the express app has no "/" route then render the home page view
     */
    if (!app._router.stack.some(r => r.route && r.route.path === '/' && r.route.methods.get)) {
        app.locals.debug && console.info(`No "/" route found, seeking default home view...`)
        // Check each app instance for a home view
        for (const appInstance of app.locals.appList.split(',')) {
            const viewPath = path.join(__dirname, app.locals.basePath, appInstance.trim(), app.locals.viewPath, "home.pug")
            if (fs.existsSync(viewPath)) {
                app.locals.debug && console.debug(`Mounting ${viewPath} as home view`)
                app.get('/', (_req, res) => {
                    res.render(viewPath, { title: 'Home' })
                })
                break
            } else {
                app.get('/', (_req, res) => {
                    console.warn(`No home view found for ${appInstance.trim()}, using default response.`)
                    res.send('It works!')
                })
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
