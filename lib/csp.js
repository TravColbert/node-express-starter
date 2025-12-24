"use strict";

module.exports = function (app) {
  return function (key, value) {
    app.locals.contentSecurityPolicy.directives[key] = [
      ...new Set([...app.locals.contentSecurityPolicy.directives[key], value]),
    ];
  };
};
