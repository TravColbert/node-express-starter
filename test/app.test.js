const tape = require('tape')
const supertest = require('supertest')
const appFactory = require('../app')
const testConfig = {
  IMPORT_ENV: false,      // Do not import from .env file through the dotenv package
  NODE_ENV: 'test',
  BASE_PATH: '../test',
  APP_LIST: 'app_test'
}

tape('GET / responds with 200 and Hello World!', t => {
  appFactory(testConfig).then(app => {
    // Add a simple route for testing if not present
    supertest(app)
      .get('/')
      .expect(200, 'Hello World!')  // Responds with the ultra-fallback success response
      .end((err, res) => {
        if (err) {
          t.error(err, 'Got error: ' + err)
        }
        t.end()
      })
  }).catch(err => t.fail(err))
})

tape('GET /bogus responds with 404', t => {
  appFactory(testConfig).then(app => {
    // Add a simple route for testing if not present
    supertest(app)
      .get('/bogus')
      .expect(404)
      .end((err, res) => {
        if (err) {
          t.error(err, 'Got error: ' + err)
        }
        t.end()
      })
  }).catch(err => t.fail(err))
})

tape('Set BASE_PATH reaches test app', t => {
  appFactory(testConfig).then(app => {
    // Add a simple route for testing if not present
    supertest(app)
      .get('/test')
      .expect(200, 'In test app')
      .end((err, res) => {
        if (err) {
          t.error(err, 'Got error: ' + err)
        }
        t.end()
      })
  }).catch(err => t.fail(err))
})
