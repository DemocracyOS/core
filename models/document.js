const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

// Define `Document` Schema
const Document = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customForm: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomForm' },
  currentVersion: { type: mongoose.Schema.Types.ObjectId, ref: 'DocumentVersion' },
  published: { type: Boolean, required: true, default: false },
  closed: { type: Boolean, required: true, default: false },
  commentsCount: { type: Number, default: 0 }
}, {
  timestamps: true
})

// Model's Plugin Extensions
Document.plugin(mongoosePaginate)

// Expose Model
module.exports = mongoose.model('Document', Document)
