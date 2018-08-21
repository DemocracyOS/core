// const { Types: { ObjectId } } = require('mongoose')
// const errors = require('../services/errors')
// const DocumentTypeVersion = require('../models/documentTypeVersion')
// const log = require('../services/logger')
// const validator = require('../services/jsonSchemaValidator')

// // Get documentType
// exports.get = function get (id) {
//   return DocumentTypeVersion.findOne({ _id: ObjectId(id) })
// }

// exports.getVersion = function getVersion (version) {
//   if (version < 0) {
//     throw errors.ErrInvalidDataAPIError('Invalid version number')
//   }
//   return DocumentTypeVersion.findOne({}).lean().then((documentType) => {
//     if (!documentType) throw errors.ErrInvalidDataErrNotFound(`DocumentType version not found`)
//     return documentType.versions[version]
//   })
// }
