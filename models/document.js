const mongoose = require('mongoose')
// const version = require('mongoose-version')
const mongoosePaginate = require('mongoose-paginate')

// Define `Document` Schema
const Document = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  published: { type: Boolean, required: true },
  customForm: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomForm' },
  hash: { type: String },
  content: {
    title: { type: String, required: true },
    imageCover: { type: String },
    fields: { type: mongoose.Schema.Types.Mixed },
    hashes: { type: mongoose.Schema.Types.Mixed }
  },
  contributions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  parentDocument: this
}, {
  timestamps: true
})

// Model's Plugin Extensions
Document.plugin(mongoosePaginate)

// Expose `Community` Model
module.exports = mongoose.model('Document', Document)