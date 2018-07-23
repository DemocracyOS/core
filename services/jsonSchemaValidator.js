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

const isDataValid = (schema, data) => {
  let validData = ajv.compile(schema).validate(data)
  if (!validData) throw Error.ErrInvalidData
}

module.exports = {
  isSchemaValid,
  isDataValid
}
