const tape = require('tape')
const supertest = require('supertest')
const appFactory = require('../app')
const testConfig = {
  IMPORT_ENV: false,
  NODE_ENV: 'test'
}

tape('GET / responds with 200', t => {
  appFactory(testConfig).then(app => {
    // Add a simple route for testing if not present
    supertest(app)
      .get('/')
      .expect(200)
      .end((err, res) => {
        t.error(err, 'No error')
        t.end()
      })
  }).catch(err => t.fail(err))
})

tape('Set BASE_PATH reaches test app', t => {
  appFactory({ ...testConfig, BASE_PATH: '../test', APP_LIST: 'app_test' }).then(app => {
    // Add a simple route for testing if not present
    supertest(app)
      .get('/test')
      .expect(200)
      .end((err, res) => {
        if (err) {
          t.error(err, 'Got error: ' + err)
        }
        t.end()
      })
  }).catch(err => t.fail(err))
})
