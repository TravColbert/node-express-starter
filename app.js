"use strict"

const { config } = require("dotenv")

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
     * You can pass an explicit config to Zest by command-line too, like this:
     *
     *   node server.js '{"APP_TITLE":"Sample App"}'
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
    if (explicitConfig && explicitConfig.hasOwnProperty('IMPORT_ENV') && explicitConfig.IMPORT_ENV !== false) require("dotenv").config()
    const fs = require('fs')
    const path = require("path")
    const express = require("express")

    /**
     * Create the express app
     */
    return new Promise((resolve, reject) => {
        const app = express()

        const loadConfigModule = (pathArray, config) => {
            if (!Array.isArray(pathArray)) {
                pathArray = [pathArray]
            }

            for (const pathItem of pathArray) {
                if (fs.existsSync(pathItem)) {
                    console.info(`Attempting load of configuration module: ${pathItem}`)
                    require(pathItem)(app, config)
                    console.info(`Loaded configuration module: ${pathItem}`)
                    return true
                }
            }
            console.debug(`Configuration module not found`)
        }

        /**
         * Set up configurable options
         */
        let optionsLoader = path.join(__dirname, 'config', 'options.js')
        loadConfigModule(optionsLoader, explicitConfig)

        /** 
         * Further setup of app
         */
        loadConfigModule(
            [
                path.join(__dirname, app.locals.basePath, 'config', 'init.js'),
                path.join(__dirname, 'config', 'init.js')
            ],
            explicitConfig
        )

        /**
         * Set up sessions
         */
        loadConfigModule(
            [
                path.join(__dirname, app.locals.basePath, 'config', 'sessions.js'),
                path.join(__dirname, 'config', 'sessions.js')
            ],
            explicitConfig
        )

        /**
         * Set up cache
         */
        loadConfigModule(
            [
                path.join(__dirname, app.locals.basePath, 'config', 'cache.js'),
                path.join(__dirname, 'config', 'cache.js')
            ],
            explicitConfig
        )

        /**
         * Set up middleware that is session-dependent
         */
        loadConfigModule(
            [
                path.join(__dirname, app.locals.basePath, 'config', 'middleware.js'),
                path.join(__dirname, 'config', 'middleware.js')
            ],
            explicitConfig
        )

        /**
         * Set up template engine
         */
        loadConfigModule(
            [
                path.join(__dirname, app.locals.basePath, 'config', 'templating.js'),
                path.join(__dirname, 'config', 'templating.js')
            ],
            explicitConfig
        )

        /**
         * Serve static files
         */
        loadConfigModule(
            [
                path.join(__dirname, app.locals.basePath, 'config', 'static.js'),
                path.join(__dirname, 'config', 'static.js')
            ],
            explicitConfig
        )

        /**
         * Set up models
         */
        loadConfigModule(
            [
                path.join(__dirname, app.locals.basePath, 'config', 'models.js'),
                path.join(__dirname, 'config', 'models.js')
            ],
            explicitConfig
        )

        /**
         * Set up routes
         */
        loadConfigModule(
            [
                path.join(__dirname, app.locals.basePath, 'config', 'routing.js'),
                path.join(__dirname, 'config', 'routing.js')
            ],
            explicitConfig
        )

        /** Resolve the promise */
        resolve(app)
    })
}