const { Types: { ObjectId } } = require('mongoose')
const { merge } = require('lodash/object')
const Document = require('../models/document')
const Comment = require('../models/comment')
const validator = require('../services/jsonSchemaValidator')
const errors = require('../services/errors')

exports.countAuthorDocuments = async function countAuthorDocuments (author) {
  return Document.count({ author: author })
}

exports.isAuthor = async function isAuthor (id, author) {
  let count = await Document.count({ _id: id, author: author })
  return count
}

// Create document
exports.create = async function create (document, customForm) {
  validator.isDataValid(
    customForm.fields,
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
exports.update = async function update (id, document, customForm) {
  // First, find if the document exists
  return Document.findOne({ _id: id })
    .then((_document) => {
      // Founded?
      if (!_document) throw errors.ErrNotFound('Document to update not found')
      // Deep merge the change(s) with the document
      let documentToSave = merge(_document, document)
      // Validate the data
      validator.isDataValid(
        customForm.fields,
        documentToSave.content.fields
      )
      // Save!
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

exports.listComments = function (query, { limit, page }) {
  return Comment
    .paginate(query, { page, limit })
}