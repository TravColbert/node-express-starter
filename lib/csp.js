"use strict";

module.exports = function (app) {
  return function (key, ...value) {
    // console.log(key, app.locals.contentSecurityPolicy.directives[key]);
    if (!app.locals.contentSecurityPolicy.directives[key]) {
      app.locals.contentSecurityPolicy.directives[key] = value;
    } else {
      app.locals.contentSecurityPolicy.directives[key] = [
        ...new Set([
          ...app.locals.contentSecurityPolicy.directives[key],
          ...value,
        ]),
      ];
    }
  };
};
