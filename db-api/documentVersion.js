const { Types: { ObjectId } } = require('mongoose')
const { merge } = require('lodash/object')
const DocumentVersion = require('../models/documentVersion')
const validator = require('../services/jsonSchemaValidator')
const errors = require('../services/errors')

exports.get = function get (query) {
  return DocumentVersion.findOne(query)
}

exports.update = async function update (id, content, customForm) {
  return DocumentVersion.findOne({ _id: id })
    .then((version) => {
      // Not found? Throw error
      if (!version) throw errors.ErrNotFound('Version document to update not found')
      validator.isDataValid(
        customForm.fields,
        content
      )
      // Merge content into version
      version.content = content
      // Save!
      return version.save()
    })
}

exports.create = async function create (documentData, customForm) {
  validator.isDataValid(
    customForm.fields,
    documentData.content
  )

  const versionToSave = {
    document: documentData.document,
    version: documentData.version,
    content: documentData.content,
    contributions: documentData.contributions
  }

  return (new DocumentVersion(versionToSave)).save()
}

// Update document
exports.updateField = async function updateField (id, field, content, customForm) {
  // First, find if the document exists
  return DocumentVersion.findOne({ _id: id })
    .then((_version) => {
      // Found?
      if (!_version) throw errors.ErrNotFound('DocumentVersion to update not found')
      // Deep merge the change(s) with the document
      _version.content[field] = content
      // Validate the data
      validator.isDataValid(
        customForm.fields,
        _version.content
      )
      // Save!
      return _version.save()
    })
}
