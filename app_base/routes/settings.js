const express = require("express")
const router = express.Router({ mergeParams: true })

module.exports = function (app) {
    // Turn off this route in production
    if (app.locals.nodeEnv === "production") return router

    router.route("/routes")
        .get((_req, res) => {
            app.locals.debug && console.debug("Got request for routes")
            res.json(app._router.stack)
        })

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
            app.locals.debug && console.debug("In settings route...")
            res.json(app.locals)
        })

    return router
}