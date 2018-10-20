const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

// Define `Document` Schema
const Document = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customForm: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomForm' },
  lastVersion: { type: Number, default: 1 },
  published: { type: Boolean, required: true, default: false },
  closed: { type: Boolean, required: true, default: false }
}, {
  timestamps: true
})

// Model's Plugin Extensions
Document.plugin(mongoosePaginate)

// Expose Model
module.exports = mongoose.model('Document', Document)
