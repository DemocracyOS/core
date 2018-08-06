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
exports.update = async function update (id, document, documentType) {
  return Document.findOne({ _id: id })
    .then((_document) => {
      if (!_document) throw errors.ErrNotFound('Document to update not found')
      let documentToSave = merge(_document, document)
      validator.isDataValid(
        documentType.fields,
        documentToSave.content.fields
      )
      return documentToSave.save()
    })
}

exports.remove = function remove (id) {
  return Document.findOne({ _id: id })
    .then((document) => {
      if (!document) throw errors.ErrNotFound('Document to remove not found')
      document.remove()
    })
}
