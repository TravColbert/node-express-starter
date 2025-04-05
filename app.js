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
        try {
            require(path.join(__dirname, 'config', 'options'))(app, explicitConfig)
        } catch (error) {
            console.error(`Error setting up configurable options!\n\tmessage: '${error.message}'`)
        }

        /** 
         * Further setup of app and middleware 
        */
        try {
            require(path.join(__dirname, 'config', 'init'))(app)
        } catch (error) {
            console.error(`Error initializing the app!\n\tmessage: '${error.message}'`)
        }

        /**
         * Set up sessions
         */
        try {
            require(path.join(__dirname, 'config', 'sessions'))(app)
        } catch (error) {
            console.error(`Error setting up sessions!\n\tmessage: '${error.message}'`)
        }

        /**
         * Set up middleware that is session-dependent
         */
        try {
            require(path.join(__dirname, 'config', 'middleware'))(app)
        } catch (error) {
            console.error(`Error setting up middleware!\n\tmessage: '${error.message}'`)
        }

        /**
         * Set up template engine
         */
        try {
            require(path.join(__dirname, app.locals.configPath, 'templating'))(app)
        } catch (error) {
            console.error(`Error setting up template engine!\n\tmessage: '${error.message}'`)
        }

        /**
         * Serve static files
         */
        app.use(express.static(path.join(__dirname, app.locals.publicPath)))

        /**
         * Set up models
         */
        try {
            require(path.join(__dirname, app.locals.configPath, 'models'))(app)
        } catch (error) {
            console.error(`Error setting up models!\n\tmessage: '${error.message}'`)
        }

        /**
         * Set up routes
         */
        try {
            require(path.join(__dirname, app.locals.configPath, 'routing'))(app)
        } catch (error) {
            console.error(`Error setting up routes!\n\tmessage: '${error.message}'`)
        }

        /** Resolve the promise */
        resolve(app)
    })
}