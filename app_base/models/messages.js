const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = new Schema({
  comment: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: false,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Message', MessageSchema)