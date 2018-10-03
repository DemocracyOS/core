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