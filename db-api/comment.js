const { Types: { ObjectId } } = require('mongoose')
// const { merge } = require('lodash/object')
const Comment = require('../models/comment')
// const validator = require('../services/jsonSchemaValidator')
const errors = require('../services/errors')

// Create comment
exports.create = async function create (comment, customForm) {
  return (new Comment(comment)).save()
}

exports.getAll = function getAll (query, { limit, page }) {
  return Comment
    .find(query)
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
