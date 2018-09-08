const { Types: { ObjectId } } = require('mongoose')
// const { merge } = require('lodash/object')
const GeneralComment = require('../models/generalComment')
// const validator = require('../services/jsonSchemaValidator')
const errors = require('../services/errors')

// Create generalComment
exports.create = async function create (generalComment, customForm) {
  return (new GeneralComment(generalComment)).save()
}