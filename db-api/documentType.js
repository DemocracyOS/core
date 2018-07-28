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
exports.get = function get () {
  return DocumentType.findOne({})
}

// Update documentType
exports.update = function update (documentType) {
  if (documentType.fields) {
    validator.isSchemaValid({
      properties: documentType.fields.properties,
      required: documentType.fields.required
    })
  }
  return DocumentType.findOne({})
    .then((_documentType) => {
      if (!_documentType) throw ErrNotFound('DocumentType to update not found')
      return Object.assign(_documentType, documentType).save()
    })
}
