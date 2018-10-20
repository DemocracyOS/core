const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

// Define `DocumentVersion` Schema
const DocumentVersion = new mongoose.Schema({
  document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  version: { type: Number, required: true },
  content: { type: mongoose.Schema.Types.Mixed },
  contributions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comments' }]
}, {
  timestamps: true
})

// Model's Plugin Extensions
DocumentVersion.plugin(mongoosePaginate)

// Expose Model
module.exports = mongoose.model('DocumentVersion', DocumentVersion)
