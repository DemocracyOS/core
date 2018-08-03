const { Types: { ObjectId } } = require('mongoose')
const { merge } = require('lodash/object')
const Document = require('../models/document')
// const log = require('../services/logger')
const validator = require('../services/jsonSchemaValidator')
const errors = require('../services/errors')

exports.checkPermission = async function getDocumentsCount (authorId, limit) {
  let count = await Document.countDocuments({ authorId: authorId })
  if (count >= limit) throw errors.ErrForbidden('Cannot create more documents')
  return true
}

exports.isAuthor = async function isAuthor (id, authorId) {
  if (!ObjectId.isValid(id)) throw errors.Error('Document not found')
  let count = await Document.countDocuments({ authorId: authorId })
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
