const { Types: { ObjectId } } = require('mongoose')
// const { merge } = require('lodash/object')
const Comment = require('../models/comment')
// const validator = require('../services/jsonSchemaValidator')
const errors = require('../services/errors')

// Create comment
exports.create = async function create (comment) {
  return (new Comment(comment)).save()
}

exports.get = function get (query) {
  return Comment
    .findOne(query).populate('user')
}

exports.count = function count (query) {
  return Comment.countDocuments(query)
}

exports.getAll = function getAll (query) {
  return Comment
    .find(query).populate('user')
}

exports.resolve = function resolve (query) {
  return Comment.findOne(query)
    .then((_comment) => {
      // Found?
      if (!_comment) throw errors.ErrNotFound('Comment to update not found')
      // Do stuff
      _comment.resolved = true
      // Save!
      return _comment.save()
    })
}
