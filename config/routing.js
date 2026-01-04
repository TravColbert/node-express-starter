const fs = require("fs");
const path = require("path");

module.exports = function (app) {
  app.locals.debug && console.debug("ℹ️  Setting up routes");

  const setRenderObject = function (req, res, next) {
    res.locals.render = {};
    return next();
  };

  const detectHtmxRequest = function (req, res, next) {
    app.locals.debug && console.debug("ℹ️  Detecting HTMX request");
    // check for htmx request
    if (!req.headers["hx-request"]) {
      res.locals.fullPage = true;
    }
    return next();
  };

  const setAppName = function (req, res, next) {
    app.locals.debug && console.debug("ℹ️  Setting appName");
    res.locals.render.appName =
      app.locals.appName || "Node.js Express Mongoose Starter";
    return next();
  };

  const setAppLang = function (req, res, next) {
    app.locals.debug &&
      console.debug(`ℹ️  Setting appLang: ${app.locals.lang}`);
    res.locals.render.lang = app.locals.lang || "en";
    return next();
  };

  const defaultRender = function (req, res, next) {
    app.locals.debug && console.debug(`*** Default renderer ***`);
    app.locals.debug &&
      console.debug(
        `*** Rendering: ${res.locals.render?.template || "index"} ***`,
      );
    app.locals.debug && console.dir(res.locals.render);
    if (res.locals.isFoundRoute)
      return res.render(
        res.locals.render?.template || "index",
        res.locals.render,
      );
    next();
  };

  const notFoundHandler = function (req, res, _next) {
    res.status(404).render("errors/404");
  };

  const errorHandler = function (err, _req, res, _next) {
    console.dir(err.message);
    var errorMessage = {
      message: err.message,
    };
    if (app.locals.debug) {
      console.dir(err.stack);
      errorMessage.stack = err.stack;
    }
    res.status(500).render("errors/500", { error: errorMessage });
  };

  const preFlightRouteCheck = (req, res, next) => {
    const routeCheck = (stack, searchPath) => {
      // let response = false
      // console.debug(`Looking for: ${searchPath}`);
      for (layer of stack) {
        // console.group();
        // console.dir(layer);
        if (layer.route && layer.route.path) {
          // console.debug("=> route and route.path found");
          // console.dir(layer.route);
          // console.dir(layer.regexp);
          const isMatch = layer.regexp.test(searchPath);
          if (isMatch) {
            // console.debug("*** Found a match! ***");
            return true;
          }
        }
        if (
          layer.name === "router" &&
          layer.handle.stack &&
          layer.regexp.test(searchPath)
        ) {
          // If we found a match at the front door of a route we have to strip
          // the part of the req.path that was found by the route. This is
          // because each layer in the stack is a regex relative to the
          // previous levels in the stack.
          // So, /settings/:key will be found first by the route's regex
          // ("/settings"), but the next layer's regex is only looking for
          // /:key.
          // console.log(`Found a route match: ${layer.regexp}`);
          const matches = layer.regexp.exec(searchPath);
          if (searchPath.startsWith(matches[0])) {
            const nextSearchPath = searchPath.replace(matches[0], "");
            // console.log(`Digging in with ${nextSearchPath}...`);
            return routeCheck(layer.handle.stack, nextSearchPath);
          }
        }
        // console.groupEnd();
      }
      return false;
    };

    res.locals.isFoundRoute = routeCheck(app._router.stack, req.path);
    // TODO: we should cache the results of a req.path so we don't have to repeat this for every request.
    console.debug(`Route found? : ${res.locals.isFoundRoute}`);
    next();
  };

  /**
   * If the express app has no "/" route then render the home page view
   */
  const findRoute = function (stack, targetPath) {
    for (const layer of stack) {
      if (layer.route && layer.route.path === targetPath) {
        return true;
      }
      // If it's a sub-router, check its internal stack
      if (layer.name === "router" && layer.handle.stack) {
        if (findRoute(layer.handle.stack, targetPath)) return true;
      }
    }
    return false;
  };

  app.use([
    preFlightRouteCheck,
    setRenderObject,
    setAppLang,
    setAppName,
    detectHtmxRequest,
  ]);

  const appInstances = [
    ...new Set([...app.locals.appList.split(","), "app_base"]),
  ];
  /**
   * Dynamically load all routers from each app instance
   * Also include the 'app_base' instance for default/shared routes
   */
  for (const appInstance of appInstances) {
    // Since we're currently in config/, we need to go up one level to __dirname
    const routerPath = path.join(
      __dirname,
      "..",
      app.locals.basePath,
      appInstance.trim(),
      app.locals.routerPath,
    );

    app.locals.debug &&
      console.debug(`ℹ️  Checking router path: ${routerPath}...`);

    if (fs.existsSync(routerPath)) {
      // Get all .js files from router path
      const routerFiles = fs
        .readdirSync(routerPath)
        .filter((file) => file.endsWith(".js"))
        .filter((file) => file !== "index.js"); // Exclude index.js

      app.use((req, res, next) => {
        // Set the current path in the request object
        req.currentPath = req.path;
        next();
      });

      // Load and mount each router
      routerFiles.forEach((file) => {
        const routeName = path.parse(file).name;
        app.locals.debug && console.debug(`ℹ️  Mounting router: ${routeName}`);
        const router = require(path.join(routerPath, file))(
          app,
          appInstance.trim(),
        );
        // The name of the route is the same as the file name
        app.use(`/${routeName}`, router);
      });
    } else {
      app.locals.debug &&
        console.debug(`⚠️  No router found at path: ${routerPath}`);
    }
  }

  /**
   * Mount the index router
   * This is the default router that handles the root path
   * The default router will be the first app instance with a router folder
   * and an index.js file
   */
  for (const appInstance of appInstances) {
    const routerPath = path.join(
      __dirname,
      "..",
      app.locals.basePath,
      appInstance.trim(),
      app.locals.routerPath,
      "index.js",
    );
    if (fs.existsSync(routerPath)) {
      app.locals.debug &&
        console.debug(
          `ℹ️  Mounting index(/) route from ${appInstance.trim()} `,
        );
      const indexRouter = require(routerPath)(app, appInstance.trim());
      app.use("/", indexRouter);
      break;
    }
  }

  if (!findRoute(app._router.stack, "/")) {
    app.locals.debug &&
      console.info(`⚠️  No "/" route found, seeking default home view...`);
    // Check each app instance for a home view
    for (const appInstance of appInstances) {
      const viewPath = path.join(
        __dirname,
        "..",
        app.locals.basePath,
        appInstance.trim(),
        app.locals.viewPath,
        "index.pug",
      );
      if (fs.existsSync(viewPath)) {
        // Is there a home view here?
        app.locals.debug &&
          console.debug(`ℹ️  Mounting ${viewPath} as home view`);
        // app.get("/", defaultRender);
        break;
      } else {
        // Otherwise use a default "Hello World!" response
        app.get("/", (_req, res) => {
          console.warn(
            `⚠️  No home view found for ${appInstance.trim()}, using default response.`,
          );
          res.send("Hello World!");
        });
      }
    }
  }

  app.use(defaultRender);

  /**
   * Default error handling
   */
  app.use(errorHandler);

  /**
   * 404 not found route
   */
  app.use(notFoundHandler);
};
