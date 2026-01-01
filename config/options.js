const path = require("path");

module.exports = function (app, explicitConfig) {
  const getConfigValue = require("../lib/tools")(explicitConfig);

  app.locals.nodeEnv = getConfigValue("NODE_ENV", "development", true);
  app.locals.debug = getConfigValue(
    "DEBUG",
    app.locals.nodeEnv !== "production",
    app.locals.nodeEnv !== "production",
  );
  app.locals.httpOn = getConfigValue(
    "HTTP_ON",
    true,
    app.locals.nodeEnv !== "production",
  );
  app.locals.httpsOn = getConfigValue(
    "HTTPS_ON",
    true,
    app.locals.nodeEnv !== "production",
  );
  app.locals.portHttp = getConfigValue(
    "PORT_HTTP",
    8080,
    app.locals.nodeEnv !== "production",
  );
  app.locals.portHttps = getConfigValue(
    "PORT_HTTPS",
    8443,
    app.locals.nodeEnv !== "production",
  );
  app.locals.tlsServerKey = getConfigValue(
    "TLS_SERVER_KEY",
    "server.key",
    app.locals.nodeEnv !== "production",
  );
  app.locals.tlsServerCert = getConfigValue(
    "TLS_SERVER_CERT",
    "server.cert",
    app.locals.nodeEnv !== "production",
  );
  app.locals.noCompression = getConfigValue(
    "NO_COMPRESSION",
    false,
    app.locals.nodeEnv !== "production",
  );
  app.locals.rateLimitFifteenMinuteWindow = getConfigValue(
    "RATE_LIMIT_15_MINUTE_WINDOW",
    0,
    app.locals.nodeEnv !== "production",
  );
  app.locals.cacheTtl = getConfigValue(
    "CACHE_TTL",
    60,
    app.locals.nodeEnv !== "production",
  );
  app.locals.lang = getConfigValue(
    "APP_LANG",
    "en",
    app.locals.nodeEnv !== "production",
  );
  app.locals.appList = getConfigValue("APP_LIST", "app_demo", true);
  app.locals.basePath = getConfigValue("BASE_PATH", ".", true);
  app.locals.configPath = getConfigValue(
    "CONFIG_PATH",
    "config",
    app.locals.nodeEnv !== "production",
  );
  app.locals.tlsPath = getConfigValue(
    "TLS_PATH",
    "tls",
    app.locals.nodeEnv !== "production",
  );
  app.locals.publicPath = getConfigValue(
    "PUBLIC_PATH",
    "public",
    app.locals.nodeEnv !== "production",
  );
  app.locals.modelPath = getConfigValue(
    "MODEL_PATH",
    "models",
    app.locals.nodeEnv !== "production",
  );
  app.locals.routerPath = getConfigValue(
    "ROUTER_PATH",
    "routes",
    app.locals.nodeEnv !== "production",
  );
  app.locals.viewPath = getConfigValue(
    "VIEW_PATH",
    "views",
    app.locals.nodeEnv !== "production",
  );
  app.locals.controllerPath = getConfigValue(
    "CONTROLLER_PATH",
    "controllers",
    app.locals.nodeEnv !== "production",
  );
  app.locals.helperPath = getConfigValue(
    "HELPER_PATH",
    "helpers",
    app.locals.nodeEnv !== "production",
  );
  app.locals.jobPath = getConfigValue(
    "JOB_PATH",
    "jobs",
    app.locals.nodeEnv !== "production",
  );
  app.locals.appName = getConfigValue(
    "APP_NAME",
    "Node.js Express Starter",
    true,
  );
  app.locals.appDescription = getConfigValue(
    "APP_DESCRIPTION",
    "A perfect way to start your Node.js Express application",
    app.locals.nodeEnv !== "production",
  );
  app.locals.appKeywords = getConfigValue(
    "APP_KEYWORDS",
    "nodejs, express, starter",
    app.locals.nodeEnv !== "production",
  );
  app.locals.sessionSecret = getConfigValue(
    "SESSION_SECRET",
    "you should really change this",
    false,
  );
  app.locals.databaseConfig = getConfigValue(
    "DATABASE_CONFIG",
    {
      dialect: "sqlite",
      storage: path.join(__dirname, "..", "database", "database.sqlite"),
      logging: app.locals.debug ? console.log : false,
      alter: true,
    },
    false,
  );
  app.locals.contentSecurityPolicy = getConfigValue(
    "CSP",
    {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        scriptSrcElem: ["'self'"],
        styleSrc: ["'self'"],
        styleSrcElem: ["'self'"],
        imgSrc: ["'self'", "data:"],
        objectSrc: ["'none'"],
      },
    },
    false,
  );

  // Now, let's load options from available app modules:
  const appInstances = [...app.locals.appList.split(","), "app_base"];

  for (const appInstance of appInstances) {
    const optionsPath = path.join(
      __dirname,
      "..",
      app.locals.basePath,
      appInstance.trim(),
      app.locals.configPath,
      "options.js",
    );
    try {
      require(optionsPath)(app, appInstance);
    } catch (err) {
      if (err.code === "MODULE_NOT_FOUND") {
        app.locals.debug &&
          console.debug(
            `⚠️  No options file found for ${appInstance.trim()} at ${optionsPath}, skipping...`,
          );
      } else {
        console.error(
          `❌  Error loading options for ${appInstance.trim()} from ${optionsPath}:`,
          err,
        );
      }
    }
  }
};
