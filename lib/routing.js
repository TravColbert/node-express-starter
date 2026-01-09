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

const routeCheck = (stack, searchPath) => {
  for (layer of stack) {
    if (layer.route && layer.route.path) {
      const isMatch = layer.regexp.test(searchPath);
      if (isMatch) {
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
      const matches = layer.regexp.exec(searchPath);
      if (searchPath.startsWith(matches[0])) {
        const nextSearchPath = searchPath.replace(matches[0], "");
        return routeCheck(layer.handle.stack, nextSearchPath);
      }
    }
  }

  return false;
};

module.exports = {
  findRoute,
  routeCheck,
};
