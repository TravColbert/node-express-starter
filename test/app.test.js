const tape = require('tape')
const supertest = require('supertest')
const appFactory = require('../app')
const testConfig = {
  IMPORT_ENV: false,
  NODE_ENV: 'test',
  BASE_PATH: '../test',
  APP_LIST: 'app_test'
}

tape('GET / responds with 200', t => {
  appFactory(testConfig).then(app => {
    // Add a simple route for testing if not present
    supertest(app)
      .get('/')
      .expect(200, 'It works!')
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
