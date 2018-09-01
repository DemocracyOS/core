const { Types: { ObjectId } } = require('mongoose')
const { ErrNotFound } = require('../services/errors')
const User = require('../models/user')
const CommunityDB = require('./community')
const validator = require('../services/jsonSchemaValidator')
const log = require('../services/logger')

// Create uset

exports.create = function create (user) {
  return (new User(user)).save()
}

// Get user

exports.get = function get (query) {
  return User.findOne(query)
}

// List users

exports.isEmpty = function get () {
  return User.findOne({})
    .then((user) => {
      if (user === null) return true
      return false
    })
}

exports.list = function list (query, { limit, page }) {
  return User
    .paginate(query, { limit, page })
}

// Update user

exports.update = async function update (id, user) {
  return User.findOne({ _id: id })
    .then(async (_user) => {
      if (!_user) throw ErrNotFound('User to update not found')
      if (user.fields) {
        let community = await CommunityDB.get()
        validator.isDataValid(
          community.userProfileSchema.fields,
          user.fields
        )
      }
      return Object.assign(_user, user).save()
    })
}

// Remove user

exports.remove = function remove (id) {
  return User.findOne({ id })
    .then((user) => {
      if (!user) throw ErrNotFound('User to remove not found')
      return user.remove()
    })
}
