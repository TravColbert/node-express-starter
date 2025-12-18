const path = require('path');

module.exports = function (app, explicitConfig) {
    const getConfigValue = require('../lib/tools')(explicitConfig)

    app.locals.nodeEnv = getConfigValue(
        "NODE_ENV",
        "development",
        true
    )
    app.locals.debug = getConfigValue(
        "DEBUG",
        app.locals.nodeEnv !== "production",
        app.locals.nodeEnv !== "production"
    )
    app.locals.port = getConfigValue(
        "PORT",
      8443,
        app.locals.nodeEnv !== "production"
    )
    app.locals.noCompression = getConfigValue(
        "NO_COMPRESSION",
        false,
        app.locals.nodeEnv !== "production"
    )
    app.locals.rateLimitFifteenMinuteWindow = getConfigValue(
        "RATE_LIMIT_15_MINUTE_WINDOW",
        0,
        app.locals.nodeEnv !== "production"
    )
    app.locals.cacheTtl = getConfigValue(
        "CACHE_TTL",
        60,
        app.locals.nodeEnv !== "production"
    )
    app.locals.lang = getConfigValue(
        "APP_LANG",
        "en",
        app.locals.nodeEnv !== "production"
    )
    app.locals.appList = getConfigValue(
        "APP_LIST",
        "app",
        true
    )
    app.locals.basePath = getConfigValue(
        "BASE_PATH",
        ".",
        true
    )
    app.locals.configPath = getConfigValue(
        "CONFIG_PATH",
        "config",
        app.locals.nodeEnv !== "production"
    )
    app.locals.tlsPath = getConfigValue(
        "TLS_PATH",
        "tls",
        app.locals.nodeEnv !== "production"
    )
    app.locals.publicPath = getConfigValue(
        "PUBLIC_PATH",
        "public",
        app.locals.nodeEnv !== "production"
    )
    app.locals.modelPath = getConfigValue(
        "MODEL_PATH",
        "models",
        app.locals.nodeEnv !== "production"
    )
    app.locals.routerPath = getConfigValue(
        "ROUTER_PATH",
        "routes",
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
    app.locals.helperPath = getConfigValue(
        "HELPER_PATH",
        "helpers",
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

    // Now, let's load options from available app modules:
    const appInstances = [...app.locals.appList.split(','), 'app_base']

    for (const appInstance of appInstances) {
        const optionsPath = path.join(
            __dirname,
            "..",
            app.locals.basePath,
            appInstance.trim(),
            app.locals.configPath,
            "options.js"
        )
        try {
            const appOptions = require(optionsPath)(app, explicitConfig)
            app.locals.debug && console.debug(`✅\tLoaded options for ${appInstance.trim()} from ${optionsPath}`)
            // Merge options into app.locals
            for (const [key, value] of Object.entries(appOptions)) {
                app.locals[key] = value
                app.locals.debug && console.debug(`\t• Set app.locals.${key} = ${JSON.stringify(value)}`)
            }
        } catch (err) {
            if (err.code === 'MODULE_NOT_FOUND') {
                app.locals.debug && console.debug(`⚠️ \tNo options file found for ${appInstance.trim()} at ${optionsPath}, skipping...`)
            } else {
                console.error(`❌\tError loading options for ${appInstance.trim()} from ${optionsPath}:`, err)
            }
        }
    }
}
