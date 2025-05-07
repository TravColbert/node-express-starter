const express = require("express")
const router = express.Router({ mergeParams: true })
const path = require('path')

module.exports = function (app) {
    const currentRouteName = path.basename(__filename, '.js')

    // Require the controller with the same name as the router
    const controller = require(path.join('../', app.locals.controllerPath, currentRouteName))(app)

    router.route("/hurl")
        .all((_req, _res) => {
            /**
             * fire an error event
             */
            app.emit("error", new Error("Intentionally thrown error"))
        })

    router.route("/routes")
        .get((_req, res) => {
            app.locals.debug && console.debug("Got request for routes")
            res.json(app._router.stack)
        })

    router.route("/cache-test")
        .get(controller.cacheTest)

    router.route("/:key")
        .get((req, res) => {
            app.locals.debug && console.debug(`Got request for settings key: ${req.params.key}`)
            if (req.params.key in app.locals) {
                return res.json(app.locals[req.params.key])
            }
            res.json({ error: "no configuration for that key" })
        })

    router.route("/")
        .get((_req, res) => {
            console.debug("In settings route...")
            res.json(app.locals)
        })

    return router
}