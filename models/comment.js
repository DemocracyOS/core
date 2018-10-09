const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

const Comment = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  field: { type: String },
  content: { type: String },
  resolved: { type: Boolean, default: false }
}, { timestamps: true })

// Model's Plugin Extensions
Comment.plugin(mongoosePaginate)

// Expose `User` Model
module.exports = mongoose.model('Comment', Comment)
