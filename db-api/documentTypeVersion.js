const { Types: { ObjectId } } = require('mongoose')
const { ErrNotFound } = require('../services/errors')
const DocumentTypeVersion = require('../models/documentTypeVersion')
// const log = require('../services/logger')
const validator = require('../services/jsonSchemaValidator')

// Get documentType
exports.get = function get (id) {
  return DocumentTypeVersion.findOne({ _id: ObjectId(id) })
}

exports.getVersion = function getByVersion (refId, version) {
  // if version is 0, version-2 = -2, and it refers to the refVersion = null (first version)
  // if version is 1, version-2 = -1, and it refers to the refVersion = null (first version)
  // if version is 2, then version-2 = 0 and it refers to the refVersion != null and refVersion = 0 (second version)
  let query = {
    refId: ObjectId(refId)
  }
  switch (version - 2) {
    case -2:
    case -1:
      query.refVersion = null
      break
    default:
      query.refVersion = version - 2
      break
  }
  return DocumentTypeVersion.findOne(query).then((documentType) => {
    if (!documentType) throw ErrNotFound(`DocumentType version not found`)
    return documentType
  })
}
