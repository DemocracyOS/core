const Ajv = require('ajv')
// const localize = require('ajv-i18n')
const ajv = Ajv({ allErrors: true })
const Error = require('./errors')

const isSchemaValid = (schema) => {
  let validSchema = ajv.validateSchema(schema)
  // console.log('Is this valid? ' + validSchema)
  // console.log(ajv.errorsText(validSchema.errors, { separator: '\n' }))
  if (!validSchema) throw Error.ErrInvalidJSONSchema(ajv.errors)
}

const isDataValid = (docTypeFields, data) => {
  console.log(docTypeFields)
  console.log(data)
  let validate = ajv.compile({
    properties: docTypeFields.properties,
    additionalProperties: false,
    required: docTypeFields.required
  })
  let valid = validate(data)
  console.log('Is this valid data? ' + valid)
  if (!valid) throw Error.ErrInvalidData(validate.errors)
  return true;
}

module.exports = {
  isSchemaValid,
  isDataValid
}
