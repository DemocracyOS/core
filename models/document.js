const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

// Define `Document` Schema
const Document = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customForm: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomForm' },
  published: { type: Boolean, required: true },
  lastVersion: { type: Number, default: 1 }
}, {
  timestamps: true
})

// Model's Plugin Extensions
Document.plugin(mongoosePaginate)

// Expose `Community` Model
module.exports = mongoose.model('Document', Document)
