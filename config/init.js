const helmet = require("helmet")
// const cors = require("cors")
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const compression = require('compression')


module.exports = function (app) {
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://unpkg.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      connectSrc: ["'self'", "https://api.example.com"]
    }
  }))
  // app.use(cors())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use(compression())
}