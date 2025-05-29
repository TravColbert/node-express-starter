const helmet = require("helmet")
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const { rateLimit } = require('express-rate-limit')

module.exports = function (app) {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'script-src-elem'"],
        scriptSrc: ["'self'", "https://unpkg.com"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        styleSrcElem: ["'self'", "'unsafe-inline'"],
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