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

exports.updateDecorations = async function updateDecorations (version, decorations) {
  let query = {
    version: version,
    resolved: false
  }
  let decorationsMap = {}
  decorations.forEach((deco) => {
    decorationsMap[deco.mark.data.id] = deco
  })
  let decorationsIds = Object.keys(decorationsMap)
  return Comment.find(query)
    .then(async (comments) => {
      // Found?
      if (!comments) throw errors.ErrNotFound('Error retrieving comments')
      // Do stuff
      console.log(query)
      await Promise.all(comments.map(async (comment) => {
        console.log(decorationsIds.includes(comment._id.toString()))
        if (decorationsIds.includes(comment._id.toString())) {
          comment.decoration.anchor = decorationsMap[comment._id].anchor
          comment.decoration.focus = decorationsMap[comment._id].focus
          comment.markModified('decoration')
        } else {
          comment.resolved = true
        }
        return comment.save()
      }))
      // Save!
    })
}
