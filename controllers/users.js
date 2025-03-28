'use strict'

module.exports = {
  login: function (req, res) {
    res.render('users/login')
  },
  authenticate: function (req, res) {
    // Authenticate the user
    res.redirect('/users/profile')
  },
  logout: function (req, res) {
    // Log the user out
    res.redirect('/')
  },
  profile: function (req, res) {
    res.render('users/profile')
  },
  index: function (req, res) {
    // Assuming you have a User model to fetch users from the database
    User.find({}, function (err, users) {
      if (err) {
        return res.status(500).send(err)
      }
      res.render('users/index', { users: users })
    })
  }
}