const { Types: { ObjectId } } = require('mongoose')
const { merge } = require('lodash/object')
const DocumentVersion = require('../models/documentVersion')
const validator = require('../services/jsonSchemaValidator')
const errors = require('../services/errors')

exports.get = function get (query) {
  return DocumentVersion.findOne(query)
}
