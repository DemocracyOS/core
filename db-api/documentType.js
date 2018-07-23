const { Types: { ObjectId } } = require('mongoose')
const { ErrNotFound } = require('../services/errors')
const DocumentType = require('../models/documentType')
// const log = require('../services/logger')
const validator = require('../services/jsonSchemaValidator')

// Create documentType

exports.create = function create (documentType) {
  validator.isSchemaValid({
    properties: documentType.fields.properties,
    required: documentType.fields.required
  })
  return (new DocumentType(documentType)).save()
}

// Get documentType
exports.get = function get (id, versions) {
  if (versions) {
    return DocumentType.findOne({ _id: ObjectId(id) }).populate('versions')
  }
  return DocumentType.findOne({ _id: ObjectId(id) })
}

// List documentTypes
exports.list = function list ({ limit, page, versions }) {
  let query = {}
  let options = { page, limit }
  if (versions) options.populate = 'versions'
  return DocumentType
    .paginate(query, options)
}

// Update documentType
exports.update = function update ({ id, documentType }) {
  validator.isSchemaValid({
    properties: documentType.fields.properties,
    required: documentType.fields.required
  })
  return DocumentType.findOne({ _id: ObjectId(id) })
    .then((_documentType) => {
      if (!_documentType) throw ErrNotFound('DocumentType to update not found')
      return Object.assign(_documentType, documentType).save()
    })
}

// Remove documentType

exports.remove = function remove (id) {
  return DocumentType.findOne({ _id: ObjectId(id) })
    .then((documentType) => {
      if (!documentType) throw ErrNotFound('DocumentType to remove not found')
      return documentType.remove()
    })
}
