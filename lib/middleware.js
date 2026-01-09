const routing = require("./routing");
const path = require("path");

module.exports = function (app, appFolder) {
  const appHello = function (req, res, next) {
    app.locals.debug &&
      console.debug(`${req.method.toUpperCase()}\t${req.path}`);
    next();
  };

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

  const setAppLanguage = function (req, res, next) {
    app.locals.debug &&
      console.debug(`ℹ️  Setting appLang: ${app.locals.lang}`);
    res.locals.render.lang = app.locals.lang || "en";
    return next();
  };

  const setFoundRoute = function (req, res, next) {
    res.locals.isFoundRoute = true;
    next();
  };

  /**
   * Middleware that looks for any appropriate file to serve (/*)
   * Focus is on templates files.
   * Currently looks for .pug, .html, .js files
   *
   * Work on a better way to add more.
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  const serveEverything = async function (req, res, next) {
    app.locals.debug && console.debug("**** In serveEverything route ****");

    const searchExtension = req.path.endsWith("/")
      ? "index.{js,pug,html}"
      : ".{js,pug,html}";

    const searchPath = path.join(
      appFolder,
      "..",
      app.locals.viewPath,
      req.path + searchExtension,
    );

    const foundFile = await routing.findFirst(searchPath);

    if (foundFile && routing.noDotsInPath(searchPath)) {
      console.debug(`Found file:`);
      console.dir(foundFile);
      res.locals.render.template = `${req.path.replace("/", "")}`;
      res.locals.render.filePath = foundFile;
      res.locals.render.fileExtension = path.extname(foundFile);
    } else {
      console.debug("Did not find a file");
      res.locals.isFoundRoute = false;
    }

    next();
  };

  const defaultRender = function (req, res, next) {
    app.locals.debug && console.debug(`*** Default renderer ***`);
    app.locals.debug &&
      console.debug(
        `*** Rendering: ${res.locals.render?.template || "index"} ***`,
      );
    app.locals.debug && console.dir(res.locals);
    if (res.locals.isFoundRoute) {
      switch (res.locals.render?.fileExtension) {
        case ".pug":
          return res.render(
            res.locals.render?.template || "index",
            res.locals.render,
          );
          break;
        case ".html":
          return res.sendFile(res.locals.render?.filePath);
          break;
        case ".js":
          const result = require(res.locals.render?.filePath)(
            res.locals.render,
          );
          return res.send(result);
          break;
      }
    }

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

  const preFlightRouteCheck = function (req, res, next) {
    res.locals.isFoundRoute = routing.routeCheck(app._router.stack, req.path);
    // TODO: we should cache the results of a req.path so we don't have to repeat this for every request.
    console.debug(`Route found? : ${res.locals.isFoundRoute}`);
    next();
  };

  return {
    appHello,
    defaultRender,
    detectHtmxRequest,
    errorHandler,
    notFoundHandler,
    preFlightRouteCheck,
    setAppLanguage,
    setAppName,
    setFoundRoute,
    setRenderObject,
    serveEverything,
  };
};
