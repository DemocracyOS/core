const { Types: { ObjectId } } = require('mongoose')
const { ErrNotFound } = require('../services/errors')
const User = require('../models/user')
const log = require('../services/logger')

// Create uset

exports.create = function create (user) {
  return (new User(user)).save()
}

// Get user

const get = exports.get = function get (query) {
  return User.findOne(query)
}

// List users

exports.isEmpty = function get() {
  return User.findOne({})
    .then((user) => {
      if (user === null) return true
      return false
    })
}

exports.list = function list ({ filter, limit, page, ids, fields }) {
  let query = {}
  if (filter !== undefined) {
    let filterToJSON = JSON.parse(filter)
    log.debug(filterToJSON)
    // if (filterToJSON.name || filterToJSON.q) {
    //   filterToJSON.name = { $regex: (filterToJSON.name || filterToJSON.q), $options: 'i' }
    //   delete filterToJSON.q
    // }
    // query = filterToJSON
    if (filter.ids) {
      log.debug(ids)
      const idsToArray = JSON.parse(ids)
      let idsArray = idsToArray.id.map((id) => {
        return ObjectId(id)
      })
      query._id = { $in: idsArray }
    }
  }
  return User
    .paginate(query, { select: fields, page, limit })
}

// Update user

exports.update = function update ({ id, user }) {
  return get({ id })
    .then((_user) => {
      if (!_user) throw ErrNotFound('User to update not found')
      return Object.assign(_user, user).save()
    })
}

// Remove user

exports.remove = function remove (id) {
  return get({ id })
    .then((user) => {
      if (!user) throw ErrNotFound('User to remove not found')
      return user.remove()
    })
}
