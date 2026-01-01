"use strict";

module.exports = function (app, appInstance) {
  const setCspDirective = require("../../lib/csp")(app);

  setCspDirective("scriptSrc", "https://unpkg.com", "'unsafe-inline'");
  setCspDirective("scriptSrcElem", "https://unpkg.com", "'unsafe-inline'");
  setCspDirective(
    "styleSrcElem",
    "https://unpkg.com",
    "'unsafe-inline'",
    "https://matcha.mizu.sh",
  );
};
