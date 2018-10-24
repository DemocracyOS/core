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
    .then(version => {
      if (!version) throw errors.ErrNotFound('Version document to update not found')

      let versionToSave = merge(version, content)

      validator.isDataValid(
        customForm.fields,
        content
      )

      return versionToSave.save()
    })
}

exports.create = function create (documentData, customForm) {
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

  return new DocumentVersion(versionToSave).save()
}
