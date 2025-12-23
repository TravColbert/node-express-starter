const helmet = require("helmet")
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const { rateLimit } = require('express-rate-limit')
const fs = require("fs");
const path = require('path');

module.exports = function (app) {

  if (app.locals.httpsOn) {
    const tlsKeyPath = path.join(__dirname, "..", app.locals.tlsPath, app.locals.tlsServerKey)
    const tlsCertPath = path.join(__dirname, "..", app.locals.tlsPath, app.locals.tlsServerCert)
    // openssl req -nodes -new -x509 -keyout server.key -out server.cert
    try {
      const privateKey = fs.readFileSync(tlsKeyPath, 'utf8');
      const certificate = fs.readFileSync(tlsCertPath, 'utf8');
      app.locals.tlsCredentials = { key: privateKey, cert: certificate };
      app.locals.debug && console.debug('✅\tTLS credentials loaded successfully')
    } catch (err) {
      console.error(`⚠️  Could not read TLS key/cert files at ${tlsKeyPath} and ${tlsCertPath}. HTTPS will be disabled.`);
      app.locals.httpsOn = false
    }
  }

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://unpkg.com", "'unsafe-inline'"],
        scriptSrcElem: ["'self'", "https://unpkg.com"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        styleSrcElem: ["'self'", "'unsafe-inline'", "https://matcha.mizu.sh"],
        imgSrc: ["'self'", "data:"],
        objectSrc: ["'none'"],
      }
    }
  }))
  app.use(morgan(app.locals.nodeEnv == "development" ? 'dev' : 'combined'))
  // Use bodyParses.json() if you need to parse JSON bodies. In a POST for example.
  // app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cookieParser())

  // Enable compression if not explicitly disabled
  if (!app.locals.noCompression) {
    app.use(compression())
    app.locals.debug && console.debug('✅  Compression is enabled')
  } else {
    app.locals.debug && console.debug('⚠️  Compression is disabled!')
  }

  if (app.locals.rateLimitFifteenMinuteWindow > 0) {
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      limit: app.locals.rateLimitFifteenMinuteWindow, // Limit each IP to X requests per `window` (here, per 15 minutes)
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    })
    app.use(limiter)
    app.locals.debug && console.debug(`✅  Rate limiting is enabled: ${app.locals.rateLimitFifteenMinuteWindow} requests per 15 minutes`)
  } else {
    app.locals.debug && console.debug(`⚠️  Rate limiting is disabled`)
  }
}