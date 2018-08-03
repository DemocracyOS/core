const { Types: { ObjectId } } = require('mongoose')
// const { ErrNotFound } = require('../services/errors')
const Document = require('../models/document')
const DocumentType = require('../models/documentType')
const log = require('../services/logger')
const validator = require('../services/jsonSchemaValidator')
const errors = require('../services/errors')

// Utility functions

exports.checkPermission = async function getDocumentsCount (authorId, limit) {
  let count = await Document.countDocuments({ authorId: authorId })
  if (count >= limit) throw errors.ErrForbidden('Cannot create more documents')
  return true
}

// Create document
exports.create = async function create (document) {
  const documentType = await DocumentType.findOne({})
  validator.isDataValid(
    documentType.fields,
    document.content.fields
  )
  return (new Document(document)).save()
}

// Get document
exports.get = function get (query) {
  if (query._id) {
    if (!ObjectId.isValid(query._id)) throw errors.ErrNotFound('Document not found')
  }
  return Document.findOne(query)
}

// List documents
exports.list = function list (query, { limit, page }) {
  return Document
    .paginate(query, { page, limit })
}

// Update document
// exports.update = function update (document) {
//   if (document.fields) {
//     validator.isSchemaValid({
//       properties: document.fields.properties,
//       required: document.fields.required
//     })
//   }
//   return Document.findOne({})
//     .then((_document) => {
//       if (!_document) throw ErrNotFound('Document to update not found')
//       return Object.assign(_document, document).save()
//     })
// }
