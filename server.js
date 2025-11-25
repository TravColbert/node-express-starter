'use strict'

const appFactory = require('./app')

// Get optional JSON string from command line argument
let config = null

if (process.argv[2]) {
  try {
    config = JSON.parse(process.argv[2]);
  } catch (err) {
    console.error('Ignoring invalid JSON string passed as argument:', err.message);
  }
}

appFactory(config)
  .then(app => {
    app.listen(app.locals.port, () => console.log(`Listening on port: ${app.locals.port}`))
  })