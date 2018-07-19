const { Types: { ObjectId } } = require('mongoose')
const { ErrNotFound } = require('../services/errors')
const DocumentType = require('../models/documentType')
const DocumentTypeVersion = require('../models/documentTypeVersion')
const log = require('../services/logger')
const validator = require('../services/jsonSchemaValidator')

// Create documentType

exports.create = function create (documentType) {
  validator.isSchemaValid(documentType.fields)
  return (new DocumentType(documentType)).save()
}

// Get documentType
exports.get = function get (id) {
  return DocumentType.findOne({ _id: ObjectId(id) }).populate('versions')
}

exports.getVersions = function getVersions () {
  return DocumentType.getVersions()
}

// List documentTypes
exports.list = function list ({ filter, limit, page, ids, fields }) {
  let query = {}
  return DocumentType
    .paginate(query, { page, limit })
}

// Update documentType

exports.update = function update ({ id, documentType }) {
  return DocumentType.findOne({ _id: ObjectId(id) })
    .then((_documentType) => {
      if (!_documentType) throw ErrNotFound('DocumentType to update not found')
      return Object.assign(_documentType, documentType).save()
    })
}

// Remove documentType

exports.remove = function remove (id) {
  return get({ id })
    .then((documentType) => {
      if (!documentType) throw ErrNotFound('DocumentType to remove not found')
      return documentType.remove()
    })
}
