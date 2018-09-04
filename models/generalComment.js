const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

const GeneralComment = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  field: { type: String },
  comment: { type: String }
}, { timestamps: true })

// Model's Plugin Extensions
GeneralComment.plugin(mongoosePaginate)

// Expose `User` Model
module.exports = mongoose.model('GeneralComment', GeneralComment)
