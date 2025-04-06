"use strict"

module.exports = function (explicitConfig = {}) {
    /**
     * We configure through 4 ways - all of them converge at different
     * points to create the app.locals configuration:
     *
     *  - explicit config ---------------------+
     *                                         |
     *  - environment (sh) --+-- process.env --+
     *                       |                 |
     *  - .env (file) -------+                 +-- app.locals (final config)
     *                                         |
     *  - config file -------------------------+
     *
     * The explicit config is when you pass a configuration JSON string to the
     * appFactory, like this:
     *
     *   appFactory({ APP_TITLE: 'Sample App' })
     *
     * Otherwise, we look to Node's process.env property to configure itself.
     * There are 2 ways you can set the process.env property: shell or .env file.
     *
     * The shell environment config is whatever variable the shell environement
     * is set to. For example:
     *
     *   export APP_TITLE='Sample App' && node server.js
     *
     * You can also set the shell environment in your package.json like this:
     *
     *  "scripts": {
     *    "test": "APP_TITLE='Sample App' node server.js"
     *  },
     *
     * A .env file may also be used. The dotenv package will read the .env file
     * and insert those values into process.env. Here is the contents of an
     * equivelant .env file:
     *
     *   APP_TITLE=Sample App
     *
     * The .env file is parsed and merged into the process.env attribute.
     *
     * Finally, a config file is retrieved.
     *
     * The process.env and config files are merged into the app.locals.
     */
    require("dotenv").config()
    const fs = require('fs')
    const path = require("path")
    const express = require("express")

    /**
     * Create the express app
     */
    return new Promise((resolve, reject) => {
        const app = express()
        /**
         * Set up configurable options
         */
        const optionsLoader = path.join(__dirname, 'config', 'options.js')
        if (fs.existsSync(optionsLoader)) {
            try {
                require(optionsLoader)(app, explicitConfig)
            } catch (error) {
                console.error(`Error setting up configurable options\n\t${error.message}`)
            }
        }

        /** 
         * Further setup of app
        */
        const initLoader = path.join(__dirname, 'config', 'init.js')
        if (fs.existsSync(initLoader)) {
            try {
                require(initLoader)(app)
            } catch (error) {
                console.error(`Error setting up initial configuration for app\n\t${error.message}`)
            }
        }

        /**
         * Set up sessions
         */
        const sessionLoader = path.join(__dirname, 'config', 'sessions.js')
        if (fs.existsSync(sessionLoader)) {
            try {
                require(sessionLoader)(app)
            } catch (error) {
                console.error(`Error setting up sessions!\n\t${error.message}`)
            }
        }

        /**
         * Set up middleware that is session-dependent
         */
        const middlewareLoader = path.join(__dirname, 'config', 'middleware.js')
        if (fs.existsSync(middlewareLoader)) {
            try {
                require(middlewareLoader)(app)
            } catch (error) {
                console.error(`Error setting up middleware:\n\t${error.message}`)
            }
        }

        /**
         * Set up template engine
         */
        const templaterEngineLoader = path.join(__dirname, 'config', 'templating.js')
        if (fs.existsSync(templaterEngineLoader)) {
            try {
                require(templaterEngineLoader)(app)
            } catch (error) {
                console.error(`Error setting up template engine:\n\t${error.message}`)
            }
        }

        /**
         * Serve static files
         */
        app.use(express.static(path.join(__dirname, app.locals.appPath, app.locals.publicPath)))

        /**
         * Set up models
         */
        const modelLoader = path.join(__dirname, 'config', 'models.js')
        if (fs.existsSync(modelLoader)) {
            try {
                require(modelLoader)(app)
            } catch (error) {
                console.error(`Error setting up models:\n\t${error.message}`)
            }
        }

        /**
         * Set up routes
         */
        const routeLoader = path.join(__dirname, 'config', 'routing.js')
        if (fs.existsSync(routeLoader)) {
            try {
                require(routeLoader)(app)
            } catch (error) {
                console.error(`Error setting up routes:\n\t${error.message}`)
            }
        }

        /** Resolve the promise */
        resolve(app)
    })
}