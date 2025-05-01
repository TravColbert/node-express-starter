const mongoose = require('mongoose');

module.exports = function (app) {
  mongoose.connection
    .on('error', (err) => {
      console.error('MongoDB connection error:', err)
    })
    .on('disconnected', () => {
      console.warn('MongoDB disconnected')
    })
    .on('connected', () => {
      console.info('MongoDB connected')
    })
    .once('open', () => {
      console.info('MongoDB connection opened')
    })

  app.locals.db = mongoose.connect(app.locals.dbUrl)
    .then(() => {
      console.info('MongoDB connection established')
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err)
    })
}