module.exports = function(app, explicitConfig) {
    const getConfigValue = require('../lib/tools')(explicitConfig)

    app.locals.nodeEnv = getConfigValue(
        "NODE_ENV", 
        "development", 
        true
    )
    // setting debug to null will disable it
    app.locals.debug = getConfigValue(
        "DEBUG",
        null,
        app.locals.nodeEnv !== "production"
    )
    app.locals.port = getConfigValue(
        "PORT",
        3000,
        app.locals.nodeEnv !== "production"
    )
    app.locals.routerPath = getConfigValue(
        "ROUTER_PATH",
        "routes",
        app.locals.nodeEnv !== "production"
    )
    app.locals.configPath = getConfigValue(
        "CONFIG_PATH",
        "config",
        app.locals.nodeEnv !== "production"
    )
    app.locals.viewPath = getConfigValue(
        "VIEW_ROOT",
        "views",
        app.locals.nodeEnv !== "production"
    )
    app.locals.publicRoot = getConfigValue(
        "PUBLIC_ROOT",
        "public",
        app.locals.nodeEnv !== "production"
    )
    app.locals.sessionSecret = getConfigValue(
        "SESSION_SECRET",
        "you should really change this",
        false
    )
}