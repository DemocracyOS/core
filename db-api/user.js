const { Types: { ObjectId } } = require('mongoose')
const { merge } = require('lodash/object')
const { ErrNotFound } = require('../services/errors')
const User = require('../models/user')
const CommunityDB = require('./community')
const validator = require('../services/jsonSchemaValidator')
const log = require('../services/logger')

const exposeAll = (expose) => {
  if (expose) return null // expose == true then show all
  else return '-avatar -email -username' // hide sensitive info
}

exports.exposeAll = exposeAll

// Create uset

exports.create = function create (user) {
  return (new User(user)).save()
}

// Get user

exports.get = function get (query, expose) {
  return User.findOne(query).select(exposeAll(expose))
}

// List users

exports.isEmpty = function isEmpty () {
  return User.findOne({})
    .then((user) => {
      if (user === null) return true
      return false
    })
}

exports.list = function list (query, { limit, page }, expose) {
  return User
    .paginate(query, { limit, page, select: exposeAll(expose) })
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
      let userToSave = Object.assign(_user, user)
      return userToSave.save()
    })
}

// Remove user

exports.remove = function remove (id) {
  return User.findOne({ _id: id })
    .then((user) => {
      if (!user) throw ErrNotFound('User to remove not found')
      return user.remove()
    })
}
