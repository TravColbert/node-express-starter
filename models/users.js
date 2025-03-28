'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Create the user schema 
 */
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

/**
 * Create a fullName virtual getter and setter
 */
UserSchema.virtual('fullName')
  .get(function () {
    return `${this.firstName} ${this.lastName}`
  })
  .set(function (fullName) {
    const parts = fullName.split(' ')
    this.firstName = parts[0]
    this.lastName = parts[1]
  })

mongoose.model('User', UserSchema)