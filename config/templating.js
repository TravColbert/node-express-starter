const fs = require("fs");
const path = require("path");

module.exports = function (app) {
  app.set("view options", { compileDebug: false });

  const templateLocations = [...app.locals.appList.split(","), "app_base"];
  let viewPaths = templateLocations
    .map((appInstance) => {
      const viewPath = path.join(
        __dirname,
        "..",
        app.locals.basePath,
        appInstance.trim(),
        app.locals.viewPath,
      );

      app.locals.debug &&
        console.debug(`ℹ️  Attempting load of view path: ${viewPath}...`);

      if (fs.existsSync(viewPath)) {
        return viewPath;
      }
      return null;
    })
    .filter((viewPath) => viewPath);

  if (
    fs.existsSync(
      path.join(__dirname, app.locals.basePath, app.locals.viewPath),
    )
  ) {
    viewPaths = viewPaths.concat(
      path.join(__dirname, app.locals.basePath, app.locals.viewPath),
    );
  }

  if (fs.existsSync(path.join(__dirname, "..", app.locals.viewPath))) {
    viewPaths = viewPaths.concat(
      path.join(__dirname, "..", app.locals.viewPath),
    );
  }

  app.locals.debug &&
    console.debug(`ℹ️  Final view paths: ${viewPaths.join(", ")}`);

  app.set("views", viewPaths);

  app.set("view engine", "pug");
};
