const { Types: { ObjectId } } = require('mongoose')
const { merge } = require('lodash/object')
const Document = require('../models/document')
// const log = require('../services/logger')
const validator = require('../services/jsonSchemaValidator')
const errors = require('../services/errors')

exports.countAuthorDocuments = async function countAuthorDocuments (authorId) {
  return Document.count({ authorId: authorId })
}

exports.isAuthor = async function isAuthor (id, authorId) {
  let count = await Document.count({ _id: id, authorId: authorId })
  return count
}

// Create document
exports.create = async function create (document, documentType) {
  validator.isDataValid(
    documentType.fields,
    document.content.fields
  )
  return (new Document(document)).save()
}

// Get document
exports.get = function get (query) {
  return Document.findOne(query)
}

// List documents
exports.list = function list (query, { limit, page }) {
  return Document
    .paginate(query, { page, limit })
}

// Update document
exports.update = async function update (document, documentType) {
  validator.isDataValid(
    documentType.fields,
    document.content.fields
  )
  return Document.findOne({})
    .then((_document) => {
      if (!_document) throw errors.ErrNotFound('Document to update not found')
      return merge(_document, document).save()
    })
}

exports.remove = function remove (id) {
  return Document.findOne({ _id: ObjectId(id) })
    .then((document) => {
      if (!document) throw errors.ErrNotFound('Document to remove not found')
      document.remove()
    })
}
