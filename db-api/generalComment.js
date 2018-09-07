const { Types: { ObjectId } } = require('mongoose')
// const { merge } = require('lodash/object')
const GeneralComment = require('../models/generalComment')
// const validator = require('../services/jsonSchemaValidator')
const errors = require('../services/errors')

// exports.isAuthor = async function isAuthor (id, author) {
//   let count = await GeneralComment.count({ _id: id, author: author })
//   return count
// }

// Create generalComment
exports.create = async function create (generalComment, customForm) {
  return (new GeneralComment(generalComment)).save()
}

// // Get generalComment
// exports.get = function get (query) {
//   return GeneralComment.findOne(query)
// }

// List general comments
// exports.list = function list (query, { limit, page }) {
//   return GeneralComment
//     .paginate(query, { page, limit })
// }

// // Update generalComment
// exports.update = async function update (id, generalComment, customForm) {
//   // First, find if the generalComment exists
//   return GeneralComment.findOne({ _id: id })
//     .then((_generalComment) => {
//       // Founded?
//       if (!_generalComment) throw errors.ErrNotFound('GeneralComment to update not found')
//       // Deep merge the change(s) with the generalComment
//       let generalCommentToSave = merge(_generalComment, generalComment)
//       // Validate the data
//       validator.isDataValid(
//         customForm.fields,
//         generalCommentToSave.content.fields
//       )
//       // Save!
//       return generalCommentToSave.save()
//     })
// }

// exports.remove = function remove (id) {
//   return GeneralComment.findOne({ _id: id })
//     .then((generalComment) => {
//       if (!generalComment) throw errors.ErrNotFound('GeneralComment to remove not found')
//       generalComment.remove()
//     })
// }
