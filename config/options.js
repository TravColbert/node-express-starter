module.exports = function (app, explicitConfig) {
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
        8080,
        app.locals.nodeEnv !== "production"
    )
    app.locals.appPath = getConfigValue(
        "APP_PATH",
        "app_demo",
        true
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
        "VIEW_PATH",
        "views",
        app.locals.nodeEnv !== "production"
    )
    app.locals.controllerPath = getConfigValue(
        "CONTROLLER_PATH",
        "controllers",
        app.locals.nodeEnv !== "production"
    )
    app.locals.modelPath = getConfigValue(
        "MODEL_PATH",
        "models",
        app.locals.nodeEnv !== "production"
    )
    app.locals.helperPath = getConfigValue(
        "HELPER_PATH",
        "helpers",
        app.locals.nodeEnv !== "production"
    )
    app.locals.publicPath = getConfigValue(
        "PUBLIC_PATH",
        "public",
        app.locals.nodeEnv !== "production"
    )
    app.locals.appName = getConfigValue(
        "APP_NAME",
        "Node.js Express Starter",
        true
    )
    app.locals.appDescription = getConfigValue(
        "APP_DESCRIPTION",
        "A perfect way to start your Node.js Express application",
        app.locals.nodeEnv !== "production"
    )
    app.locals.appKeywords = getConfigValue(
        "APP_KEYWORDS",
        "nodejs, express, starter",
        app.locals.nodeEnv !== "production"
    )
    app.locals.sessionSecret = getConfigValue(
        "SESSION_SECRET",
        "you should really change this",
        false
    )
}
