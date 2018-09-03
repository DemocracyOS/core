const { Types: { ObjectId } } = require('mongoose')
const { ErrNotFound } = require('../services/errors')
const { merge } = require('lodash/object')
const CustomForm = require('../models/customForm')
const validator = require('../services/jsonSchemaValidator')

// Get customForm
exports.get = function get (query) {
  return CustomForm.findOne(query)
}

// Create customForm
exports.create = function create (customForm) {
  validator.isSchemaValid({
    properties: customForm.fields.properties,
    required: customForm.fields.required
  })
  return (new CustomForm(customForm)).save()
}

// List customForms
exports.list = function list (query, { limit, page }) {
  let options = { page, limit }
  return CustomForm
    .paginate(query, options)
}

// Update customForm
exports.update = function update (id, customForm) {
  if (customForm.fields) {
    validator.isSchemaValid({
      properties: customForm.fields.properties,
      required: customForm.fields.required
    })
  }
  return CustomForm.findOne({ _id: id })
    .then((_customForm) => {
      if (!_customForm) throw ErrNotFound('CustomForm to update not found')
      return Object.assign(_customForm, customForm).save()
    })
}

// Remove customForm
exports.remove = async function remove (id) {
  return CustomForm.findOne({ _id: id })
    .then((customForm) => {
      if (!customForm) throw ErrNotFound('CustomForm to remove not found')
      return customForm.remove()
    })
}
