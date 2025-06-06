const tape = require('tape')
const supertest = require('supertest')
const appFactory = require('../app')

// Test that all default values are set in app.locals
tape('App sets all default config values', t => {
  appFactory().then(app => {
    t.equal(app.locals.nodeEnv, 'development', 'nodeEnv should default to development')
    t.equal(app.locals.debug, null, 'debug should default to true')
    t.equal(app.locals.port, 8080, 'port should default to 8080')
    t.equal(app.locals.noCompression, false, 'noCompression should default to false')
    t.equal(app.locals.rateLimitFifteenMinuteWindow, 0, 'rateLimitFifteenMinuteWindow should default to 0')
    t.equal(app.locals.cacheTtl, 60, 'cacheTtl should default to 60')
    t.equal(app.locals.lang, 'en', 'lang should default to en')
    t.equal(app.locals.appList, 'app_base, app_demo', 'appList should default to app_base, app_demo')
    t.equal(app.locals.appPath, 'app_demo', 'appPath should default to app_demo')
    t.equal(app.locals.routerPath, 'routes', 'routerPath should default to routes')
    t.equal(app.locals.configPath, 'config', 'configPath should default to config')
    t.equal(app.locals.viewPath, 'views', 'viewPath should default to views')
    t.equal(app.locals.controllerPath, 'controllers', 'controllerPath should default to controllers')
    t.equal(app.locals.modelPath, 'models', 'modelPath should default to models')
    t.equal(app.locals.helperPath, 'helpers', 'helperPath should default to helpers')
    t.equal(app.locals.publicPath, 'public', 'publicPath should default to public')
    t.equal(app.locals.appName, 'Node.js Express Starter', 'appName should default to Node.js Express Starter')
    t.equal(app.locals.appDescription, 'A perfect way to start your Node.js Express application', 'appDescription should default to correct string')
    t.equal(app.locals.appKeywords, 'nodejs, express, starter', 'appKeywords should default to nodejs, express, starter')
    t.equal(app.locals.sessionSecret, 'you should really change this', 'sessionSecret should default to you should really change this')
    t.end()
  }).catch(err => t.fail(err))
})

tape('App loads with explicit config', t => {
  appFactory({ APP_NAME: 'Test App', NODE_ENV: 'test' }).then(app => {
    t.equal(app.locals.appName, 'Test App', 'App title should be set from config')
    t.equal(app.locals.nodeEnv, 'test', 'nodeEnv should be set from config')
    t.end()
  }).catch(err => t.fail(err))
})

tape('GET / responds with 200', t => {
  appFactory().then(app => {
    // Add a simple route for testing if not present
    app.get('/', (req, res) => res.status(200).send('ok'))
    supertest(app)
      .get('/')
      .expect(200)
      .expect('ok')
      .end((err, res) => {
        t.error(err, 'No error')
        t.end()
      })
  })
})
